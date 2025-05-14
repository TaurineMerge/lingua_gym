var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import logger from "../../utils/logger/Logger.js";
// !NOT TESTED!
let AdvancedSearchService = class AdvancedSearchService {
    constructor(advancedSearchRepository) {
        this.advancedSearchRepository = advancedSearchRepository;
    }
    performSearch(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, limit = 20, offset = 0) {
            try {
                logger.info("Performing advanced search in service with params:", Object.assign(Object.assign({}, params), { limit, offset }));
                const filterInstance = this.advancedSearchRepository(params);
                const results = yield filterInstance.search(limit, offset);
                logger.info(`Search completed successfully with ${results.items.length} results.`);
                return results;
            }
            catch (error) {
                logger.error("Error during advanced search:", error);
                throw new Error("Failed to perform advanced search");
            }
        });
    }
};
AdvancedSearchService = __decorate([
    injectable(),
    __param(0, inject("AdvancedSearchRepository")),
    __metadata("design:paramtypes", [Function])
], AdvancedSearchService);
export { AdvancedSearchService };
