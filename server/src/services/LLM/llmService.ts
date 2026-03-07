import { GoogleGenerativeAI } from "@google/generative-ai";

class LLMService {
    private model: any = null;

    private getModel() {
        if (!this.model) {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
            this.model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 500,
                    responseMimeType: "application/json",
                }
            });
        }
        return this.model;
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const result = await this.getModel().generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Error generating response from LLM:", error);
            throw new Error("Failed to generate response from LLM");
        }
    }
}

export default new LLMService();