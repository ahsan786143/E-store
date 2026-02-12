import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ReviewModel from "@/models/ReviewModel";

export async function POST(request) {
  try {
    
    await connectToDatabase();

    const payload = await request.json();

    const schema = zSchema.pick({
      product: true,
    userId: true,
    rating: true,
    review: true,
    title: true,
    });

    const validated = schema.safeParse(payload);
    if (!validated.success) {
      return response(false, 400, "Invalid or missing input fields", validated.error);
    }

    const { product, userId, rating, review, title } = validated.data;

    const newReview = await ReviewModel({
      product: product,
      user: userId,
      rating: rating,
      review: review,
      title: title,
    })
    await newReview.save();
    return response(true, 200, "Your review submitted successfully", newReview);
    
  } catch (error) {
    return catchError(error);
  }
}