import { Event } from "electron";
import { AbstractStoreHandler } from "./AbstractStoreHandler";

class CounterHandler extends AbstractStoreHandler {

  private counter = 0;

  public constructor() {
    super();
  }

  public register = () => {
    this.onR2m("r2m-counter-delta", this.counterDelta);
    this.onR2m("r2m-counter-delta-string", this.counterDeltaString);
  }

  private counterDelta = (ipc:string, event:Event, arg:any) => {
    const delta:number = arg.delta;
    this.counter += delta;
    this.sendR2mReply(ipc, event, this.counter);
  }

  private counterDeltaString = (ipc:string, event:Event, arg:any) => {
    const delta:number = Number(arg as string);
    this.counter += delta;
    this.sendR2mReply(ipc, event, this.counter);
  }

}

export { CounterHandler };
