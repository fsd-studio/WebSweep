import { SendMailClient } from "zeptomail";
import * as z from "zod";

export async function POST(req) {
  const url = "https://api.zeptomail.eu/v1.1/email/template";
  const token = process.env.ZEPTO_TOKEN;

  const client = new SendMailClient({ url, token });
  
  const Form = z.object({ 
      name: z.string().nonempty("This field is required."),
      email: z.email("Wrong email format.").nonempty("This field is required."),
      subject: z.string().nonempty("This field is required."),
      message: z.string().nonempty("This field is required.")
  });

  try {
    const body = await req.json();

    Form.parse(body)

    const response = await client.sendMailWithTemplate({
      mail_template_key: "13ef.14fba6797859335d.k1.75f2dc40-84db-11f0-ab6a-66e0c45c7bae.198f6001004",
      from: {
        address: "info@fsd-studio.com",
        name: "noreply",
      },
      to: [
        {
          email_address: {
            address: "info@fsd-studio.com",
            name: "Fanni Véh",
          },
        },
      ],
      merge_info: {
        name: body.name || "no name",
        subject: body.subject || "no subject",
        message: body.message || "no message",
        restaurant_name: body.restaurant_name || "undefined",
        submission_date: new Date().toLocaleDateString(),
      },
    });

    return new Response(JSON.stringify({ success: true, data: response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ success: false, fieldErrors: z.flattenError(error).fieldErrors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
