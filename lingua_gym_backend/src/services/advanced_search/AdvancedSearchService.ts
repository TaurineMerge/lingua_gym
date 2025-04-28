import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { DictionarySet } from "../../database/interfaces/DbInterfaces.js";
import { AdvancedSearchModel } from "../../models/advanced_search/AdvancedSearchModel.js";
import logger from "../../utils/logger/Logger.js";
import { AdvancedSearchParameters } from "../../models/advanced_search/AdvancedSearchModel.js";

interface AdvancedSearchResult {
    items: Array<DictionarySet & { tags: string[], ownerName: string }>;
    totalCount: number;
}

// !NOT TESTED!
@injectable()
class AdvancedSearchService {
    constructor(@inject("AdvancedSearchModel") private advancedSearchModel: (params: AdvancedSearchParameters) => AdvancedSearchModel) {}

    async performSearch(params: AdvancedSearchParameters, limit: number = 20, offset: number = 0): (Promise<AdvancedSearchResult> /*| Promise<Text>*/) {
        try {
            logger.info("Performing advanced search in service with params:", { ...params, limit, offset });

            const filterInstance = this.advancedSearchModel(params);
            const results = await filterInstance.search(limit, offset);

            logger.info(`Search completed successfully with ${results.items.length} results.`);
            return results;
        } catch (error) {
            logger.error("Error during advanced search:", error);
            throw new Error("Failed to perform advanced search");
        }
    }
}

export { AdvancedSearchService, AdvancedSearchResult };
