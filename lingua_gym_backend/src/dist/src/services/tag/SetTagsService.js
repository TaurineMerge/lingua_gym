var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
import { SetTagsModel } from '../../../src/models/tag/tag.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';
let SetTagsService = class SetTagsService {
    constructor(model) {
        this.setTagsModel = model;
    }
    addTagToSet(setId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId || !tagId) {
                logger.warn({ setId, tagId }, 'Validation failed: setId or tagId missing');
                return false;
            }
            try {
                return yield this.setTagsModel.addTagToSet(setId, tagId);
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
                return yield this.setTagsModel.removeTagFromSet(setId, tagId);
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
                return yield this.setTagsModel.getTagsForSet(setId);
            }
            catch (error) {
                logger.error({ error, setId }, 'Failed to get tags for set');
                return [];
            }
        });
    }
};
SetTagsService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [SetTagsModel])
], SetTagsService);
export default SetTagsService;
