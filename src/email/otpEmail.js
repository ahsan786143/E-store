export const otpEmail = (otp) => {
  const html = `
<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
	<title>Email Verification</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<style>
		* {
			box-sizing: border-box;
		}
		body {
			margin: 0;
			padding: 0;
			background-color: #FFFFFF;
			-webkit-text-size-adjust: none;
			text-size-adjust: none;
		}
		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}
		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}
		p {
			line-height: inherit;
		}
		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}
		.image_block img + div {
			display: none;
		}
		sup, sub {
			font-size: 75%;
			line-height: 0;
		}
		@media (max-width:520px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}
			.icons-inner {
				text-align: center;
			}
			.icons-inner td {
				margin: 0 auto;
			}
			.mobile_hide {
				display: none;
			}
			.row-content {
				width: 100% !important;
			}
			.stack .column {
				width: 100%;
				display: block;
			}
			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}
			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body>
	<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF;">
		<tr>
			<td>
				<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f5f5f5; padding: 50px 0;">
					<tr>
						<td>
							<table align="center" width="500" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; color: #000000; width: 500px; margin: 0 auto;">
								<tr>
									<td style="padding: 15px 0 20px; text-align: left; font-family: Arial, Helvetica, sans-serif;">
										
										<!-- IMAGE -->
										<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
											<tr>
												<td style="padding: 5px; text-align: center;">
													<img src="https://res.cloudinary.com/dxiqhubut/image/upload/v1763473473/otp-email_milbys.png" width="250" style="display: block; width: 100%; max-width: 250px; border: 0;" alt="Email Verification" />
												</td>
											</tr>
										</table>

										<!-- TITLE -->
										<h1 style="color: #393d47; font-size: 25px; text-align: center; margin: 15px 0; font-weight: bold;">
											Email Verification
										</h1>

										<!-- MESSAGE -->
										<p style="font-size: 14px; color: #393d47; text-align: center; line-height: 150%; margin: 0 0 15px;">
											We received a request to verify your identity. Use the following One-Time Password (OTP) to complete the verification process:
										</p>

										<!-- OTP CODE -->
										<h1 style="color: #7747FF; font-size: 38px; font-weight: 700; text-align: center; letter-spacing: 3px; margin: 10px 0;">
											${otp}
										</h1>

										<!-- NOTE -->
										<p style="font-size: 13px; color: #393d47; text-align: center; line-height: 150%; margin: 10px 0;">
											<strong>Note:</strong> This OTP is valid for 10 minutes. Do not share it with anyone.
										</p>
										<p style="font-size: 13px; color: #393d47; text-align: center; line-height: 150%; margin: 0;">
											If you did not request this, please ignore this message.
										</p>

										<!-- SIGNATURE -->
										<p style="font-size: 13px; color: #393d47; text-align: center; line-height: 150%; margin: 15px 0;">
											Thank you,<br />
											<a href="https://www.instagram.com/ahsan_ch057" target="_blank" style="color: #7747FF; text-decoration: none; font-weight: bold;">
												Developer Ahsan Ch
											</a>
										</p>

									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
  `;

  return html;
};
