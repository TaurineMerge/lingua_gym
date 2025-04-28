var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { container } from "tsyringe";
import { AdvancedSearchService } from "../services/advanced_search/AdvancedSearchService.js";
import logger from "../utils/logger/Logger.js";
const advancedSearchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { value, type, language, users, tags, limit = 20, offset = 0 } = req.query;
        const searchService = container.resolve(AdvancedSearchService);
        const results = yield searchService.performSearch({
            value: typeof value === "string" ? value : undefined,
            type: typeof type === "string" ? type : undefined,
            language: typeof language === "string" ? language : undefined,
            users: Array.isArray(users)
                ? users
                : typeof users === "string"
                    ? [users]
                    : undefined,
            tags: Array.isArray(tags)
                ? tags
                : typeof tags === "string"
                    ? [tags]
                    : undefined
        }, Number(limit), Number(offset));
        const data = { items: [], totalCount: 0 };
        results.items.forEach((result) => {
            if (result.dictionarySetId !== undefined) {
                data.items.push({
                    id: result.dictionarySetId,
                    name: result.name,
                    description: result.description,
                    filters: {
                        time: result.createdAt,
                        materialType: 'Set',
                        language: result.languageCode,
                        tags: result.tags,
                        users: [result.ownerName]
                    }
                });
            }
        });
        data.totalCount = results.totalCount;
        res.status(200).json(Object.assign({}, data));
    }
    catch (err) {
        logger.error("Advanced search controller error:", err);
        res.status(500).json({ error: "Internal server error during advanced search." });
    }
});
export default advancedSearchController;
