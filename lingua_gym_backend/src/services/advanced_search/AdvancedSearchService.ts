import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { IDictionarySet } from "../../database/interfaces/DbInterfaces.js";
import { AdvancedSearchRepository } from "../../repositories/advanced_search/AdvancedSearchRepository.js";
import logger from "../../utils/logger/Logger.js";
import { AdvancedSearchParameters } from "../../repositories/advanced_search/AdvancedSearchRepository.js";

interface AdvancedSearchResult {
    items: Array<IDictionarySet & { tags: string[], ownerName: string }>;
    totalCount: number;
}

// !NOT TESTED!
@injectable()
class AdvancedSearchService {
    constructor(@inject("AdvancedSearchRepository") private advancedSearchRepository: (params: AdvancedSearchParameters) => AdvancedSearchRepository) {}

    async performSearch(params: AdvancedSearchParameters, limit: number = 20, offset: number = 0): (Promise<AdvancedSearchResult> /*| Promise<Text>*/) {
        try {
            logger.info("Performing advanced search in service with params:", { ...params, limit, offset });

            const filterInstance = this.advancedSearchRepository(params);
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
