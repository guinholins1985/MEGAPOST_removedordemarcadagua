
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const removeWatermark = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: 'Remova a marca d\'água desta imagem. Preserve todos os outros detalhes e a qualidade original da imagem. O resultado deve ser apenas a imagem editada, sem nenhum texto adicional.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    }

    throw new Error("A resposta da API não continha uma imagem válida.");

  } catch (error) {
    console.error("Erro no serviço Gemini:", error);
    throw new Error("Falha na comunicação com a API de IA.");
  }
};
