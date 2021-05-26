import { Component, BaseComponent } from "@jovotech/framework";
import { YesNoComponent } from "./YesNoComponent";

import { AskForPizzaLoveOutput } from "./output/AskForPizzaLoveOutput";
import { LovesPizzaOutput } from "./output/LovesPizzaOutput";
import { HatesPizzaOutput } from "./output/HatesPizzaOutput";

@Component({
  components: [YesNoComponent],
})
export class LoveHatePizzaComponent extends BaseComponent {
  START(): Promise<void> {
    return this.$delegate(YesNoComponent, {
      resolve: {
        yes: this.LovesPizza,
        no: this.HatesPizza,
        fail: this.LovesPizza,
      },
      config: {
        output: AskForPizzaLoveOutput,
      },
    });
  }

  LovesPizza(): Promise<void> {
    return this.$send(LovesPizzaOutput);
  }

  HatesPizza(): Promise<void> {
    return this.$send(HatesPizzaOutput);
  }

  UNHANDLED(): Promise<void> {
    return this.START();
  }
}
