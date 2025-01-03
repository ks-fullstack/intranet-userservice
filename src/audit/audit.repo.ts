import IAudit from "./audit.interface";
import auditModel from "./audit.model";

class AuditRepo {
  public create(inputData: IAudit) {
    const addNewLog = new auditModel(inputData);
    return addNewLog.save();
  }
}

export default new AuditRepo();
