// 账户，
// 实现  index  -> base -> ../index
import molecule from "@dtinsight/molecule";
import { IExtension } from "@dtinsight/molecule/esm/model";
import { IExtensionService } from "@dtinsight/molecule/esm/services";
import { ACCOUNT_ID, accountActivityBar } from "./base";
import { accountSidebar } from "./base";


export class AccountExtension implements IExtension {
  id: string = ACCOUNT_ID;
  name: string = 'Account';

  activate(extensionCtx: IExtensionService): void {
      this.initUI();
  }

  initUI() {
      molecule.sidebar.add(accountSidebar);
      molecule.activityBar.add(accountActivityBar);
  }

  dispose(extensionCtx: IExtensionService): void {
      molecule.sidebar.remove(accountSidebar.id);
      molecule.activityBar.remove(accountActivityBar.id);
  }
}