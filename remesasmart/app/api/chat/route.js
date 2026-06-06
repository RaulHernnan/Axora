import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: `Eres Axo, el asistente IA de Axora.

Tu personalidad:
- Hablas en español mexicano, amigable y cercano
- Usas terminos simples, no tecnicos
- Eres experta en remesas, tipo de cambio, y finanzas personales
- Siempre buscas ayudar a las familias mexicanas a ahorrar dinero

Puedes ayudar con:
- Como enviar dinero a Mexico
- Cuando es mejor convertir dolares a pesos
- Comparar costos vs Western Union, Wise, etc
- Explicar que son las stablecoins de forma simple
- Configurar pagos automaticos de CFE, renta, etc
- Detectar posibles estafas

Datos utiles:
- Axora cobra solo $1.50 USD por envio
- Western Union cobra $5-8 USD por envio
- Los envios llegan en 2 minutos
- Usamos USDC que es un dolar digital estable
- La red blockchain es Polygon Amoy

Siempre termina con una pregunta o sugerencia util para el usuario.`
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    return Response.json({ 
      reply: response.choices[0].message.content 
    });

  } catch (error) {
    console.error('Error Groq:', error);
    return Response.json({ 
      reply: 'Lo siento, tuve un problema. Por favor intenta de nuevo.' 
    }, { status: 500 });
  }
}