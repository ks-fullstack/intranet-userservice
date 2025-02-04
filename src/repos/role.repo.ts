import { IRole, IRoleFilter, IRoleUpdate, RoleFieldType } from "../interface/role.interface";
import roleModel from "../models/role.model";

class RoleRepo {
  private defaultSelectedFields: string = "-_id roleId description isActive createdBy updatedBy ";

  public getOne(id: string, selectedFields?: RoleFieldType) {
    const selectedFieldsExp = this.defaultSelectedFields + (selectedFields?.join(" ") || "");
    return roleModel.findOne({id}).select(selectedFieldsExp);
  }

  public getAll(filter: string, selectedFields?: RoleFieldType) {
    const filterExp: IRoleFilter = filter ? JSON.parse(filter) : {};
    const selectFieldsExp = this.defaultSelectedFields + (selectedFields?.join(" ") || "");
    return roleModel.find({filterExp}).select(selectFieldsExp);
  }

  public getCount(filter: string) {
    const filterExp: IRoleFilter = filter ? JSON.parse(filter) : {};
    return roleModel.find(filterExp).estimatedDocumentCount();
  }

  public create(inputData: IRole | IRole[]) {
    return roleModel.insertMany(inputData);
  }

  public update(filterExp: IRoleFilter, inputData: IRoleUpdate) {
    return roleModel.updateMany(filterExp, inputData, {new: true});
  }

  public findOneAndUpdate(filterExp: IRoleFilter, inputData: IRoleUpdate) {
    return roleModel.findOneAndUpdate(filterExp, inputData, {new: true});
  }

  public delete(filterExp: IRoleFilter) {
    return roleModel.deleteMany(filterExp);
  }
}

export default new RoleRepo();
