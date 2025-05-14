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
import { SetTagRepository } from '../../repositories/tag/tag.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';
let SetTagService = class SetTagService {
    constructor(setTagModel) {
        this.setTagModel = setTagModel;
    }
    addTagToSet(setId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId || !tagId) {
                logger.warn({ setId, tagId }, 'Validation failed: setId or tagId missing');
                return false;
            }
            try {
                return yield this.setTagModel.addTagToSet(setId, tagId);
            }
            catch (error) {
                logger.error({ error, setId, tagId }, 'Failed to add tag to set');
                return false;
            }
        });
    }
    removeTagFromSet(setId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId || !tagId) {
                logger.warn({ setId, tagId }, 'Validation failed: setId or tagId missing');
                return false;
            }
            try {
                return yield this.setTagModel.removeTagFromSet(setId, tagId);
            }
            catch (error) {
                logger.error({ error, setId, tagId }, 'Failed to remove tag from set');
                return false;
            }
        });
    }
    getTagsForSet(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId) {
                logger.warn('Set ID is required to get tags');
                return [];
            }
            try {
                return yield this.setTagModel.getTagsForSet(setId);
            }
            catch (error) {
                logger.error({ error, setId }, 'Failed to get tags for set');
                return [];
            }
        });
    }
};
SetTagService = __decorate([
    injectable(),
    __param(0, inject('SetTagModel')),
    __metadata("design:paramtypes", [SetTagRepository])
], SetTagService);
export default SetTagService;
