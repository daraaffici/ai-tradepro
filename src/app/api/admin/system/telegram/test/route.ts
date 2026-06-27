import { NextResponse } from "next/server";

export async function POST() {

    try{

        const token = process.env.TELEGRAM_BOT_TOKEN;

        const chatId = process.env.TELEGRAM_CHAT_ID;

        if(!token || !chatId){

            return NextResponse.json({

                success:false,

                error:"Telegram not configured"

            });

        }

        const message = `

✅ AI TradePro

Telegram Test Successful

Version : 1.0

`;

        await fetch(

            `https://api.telegram.org/bot${token}/sendMessage`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    chat_id:chatId,

                    text:message

                })

            }

        );

        return NextResponse.json({

            success:true

        });

    }catch(error){

        return NextResponse.json({

            success:false

        });

    }

}