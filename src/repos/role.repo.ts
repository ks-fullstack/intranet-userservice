import { IRole, IRoleFilter, IRoleUpdate } from "../interface/role.interface";
import roleModel from "../models/role.model";

class RoleRepo {
  public getOne(id: string) {
    return roleModel.findOne({id});
  }

  public getAll(filter: string) {
    const filterExp: IRoleFilter = filter ? JSON.parse(filter) : {};
    return roleModel.find({filterExp});
  }

  public getCount(filter: string) {
    const filterExp: IRoleFilter = filter ? JSON.parse(filter) : {};
    return roleModel.find(filterExp).estimatedDocumentCount();
  }

  public create(inputData: IRole) {
    const saveData = new roleModel(inputData);
    return new Promise((resolve, reject) => {
      saveData.save().then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public update(filterExp: IRoleFilter, inputData: IRoleUpdate) {
    return roleModel.findOneAndUpdate(filterExp, inputData, {new: true});
  }

  public delete(filterExp: IRoleFilter) {
    return roleModel.deleteMany(filterExp);
  }
}

export default new RoleRepo();
