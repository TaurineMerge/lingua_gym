var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from "../utils/logger/Logger.js";
import ContextTranslationService from "../services/text/ContextTranslationService.js";
import EPub from "epub";
import path from "path";
import fs from "fs";
class TextController {
    static translate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info('Text translation attempt');
                const { original, targetLanguageCode, originalLanguageCode } = req.body;
                const contextTranslationService = new ContextTranslationService();
                const translatedText = yield contextTranslationService.translate(original, originalLanguageCode, targetLanguageCode);
                logger.info('Text translated successfully: ', { original, targetLanguageCode, originalLanguageCode, translatedText });
                res.status(201).json({ message: 'Text translated: ', original, targetLanguageCode, originalLanguageCode, translatedText });
            }
            catch (error) {
                logger.error({ error }, 'Text translation failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
    static translateContext(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info('Text translation attempt');
                const { original, targetLanguageCode, originalLanguageCode, context } = req.body;
                const contextTranslationService = new ContextTranslationService();
                const translatedText = yield contextTranslationService.translateContext(original, originalLanguageCode, targetLanguageCode, context);
                logger.info('Text translated successfully: ', { original, targetLanguageCode, originalLanguageCode, context, translatedText });
                res.status(201).json({ message: 'Text translated: ', original, targetLanguageCode, originalLanguageCode, context, translatedText });
            }
            catch (error) {
                logger.error({ error }, 'Text translation failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
    static upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    res.status(400).json({ error: "No file uploaded" });
                    return;
                }
                logger.info('EPUB uploaded successfully');
                const epubPath = req.file.path;
                const epub = new EPub(epubPath, "/imagewebroot/", "/articlewebroot/");
                epub.on("error", (err) => {
                    logger.error("EPUB error:", err);
                    res.status(500).json({ error: "Failed to read EPUB" });
                    return;
                });
                epub.on("end", () => {
                    const metadata = epub.metadata;
                    const chapters = epub.flow.map((chapter) => ({
                        id: chapter.id,
                        title: chapter.title,
                        order: chapter.order,
                    }));
                    if (!req.file) {
                        res.status(400).json({ error: "No file uploaded" });
                        return;
                    }
                    return res.json({
                        message: "EPUB parsed successfully",
                        originalName: req.file.originalname,
                        path: req.file.filename,
                        metadata,
                        chapters,
                    });
                });
                epub.parse();
            }
            catch (error) {
                logger.error({ error }, 'EPUB parsing failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
    static download(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const __dirname = path.resolve();
                const { filename } = req.params;
                console.log(filename);
                const filePath = path.resolve(__dirname, "uploads");
                console.log(filePath);
                if (!fs.existsSync(filePath)) {
                    res.status(404).json({ error: "Файл не найден" });
                    return;
                }
                res.download(filePath, filename, (err) => {
                    if (err) {
                        logger.error({ err }, "Ошибка при отправке файла");
                        res.status(500).json({ error: "Ошибка при скачивании файла" });
                    }
                });
            }
            catch (error) {
                logger.error({ error }, "Download failed");
                res.status(500).json({ error: error.message });
            }
        });
    }
}
export default TextController;
