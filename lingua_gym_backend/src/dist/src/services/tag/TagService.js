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
import { TagRepository } from '../../repositories/tag/tag.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';
let TagService = class TagService {
    constructor(tagRepository) {
        this.tagRepository = tagRepository;
    }
    createTag(tagId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tagId || !name) {
                logger.warn({ tagId, name }, 'Validation failed: tagId or name missing');
                return null;
            }
            try {
                return yield this.tagRepository.createTag(tagId, name);
            }
            catch (error) {
                logger.error({ error, tagId, name }, 'Failed to create tag');
                return null;
            }
        });
    }
    getTagById(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tagId) {
                logger.warn('Tag ID is required to fetch tag');
                return null;
            }
            try {
                return yield this.tagRepository.getTagById(tagId);
            }
            catch (error) {
                logger.error({ error, tagId }, 'Failed to get tag by ID');
                return null;
            }
        });
    }
    getAllTags() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.tagRepository.getAllTags();
            }
            catch (error) {
                logger.error({ error }, 'Failed to get all tags');
                return [];
            }
        });
    }
    updateTag(tagId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tagId || !name) {
                logger.warn({ tagId, name }, 'Validation failed: tagId or name missing');
                return false;
            }
            try {
                return yield this.tagRepository.updateTag(tagId, name);
            }
            catch (error) {
                logger.error({ error, tagId, name }, 'Failed to update tag');
                return false;
            }
        });
    }
    deleteTag(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tagId) {
                logger.warn('Tag ID is required to delete tag');
                return false;
            }
            try {
                return yield this.tagRepository.deleteTag(tagId);
            }
            catch (error) {
                logger.error({ error, tagId }, 'Failed to delete tag');
                return false;
            }
        });
    }
};
TagService = __decorate([
    injectable(),
    __param(0, inject('TagRepository')),
    __metadata("design:paramtypes", [TagRepository])
], TagService);
export default TagService;
