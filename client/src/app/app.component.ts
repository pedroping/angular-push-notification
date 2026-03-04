import { Component } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { PushNotificationService } from "./pushNotification.service";

const VAPID_PUBLIC =
  "BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  standalone: false,
})
export class AppComponent {
  title = "angular-push-notifications";

  constructor(
    private swPush: SwPush,
    private pushService: PushNotificationService,
  ) {
    this.swPush
      .requestSubscription({
        serverPublicKey: VAPID_PUBLIC,
      })
      .then((subscription) => {
        console.log("Usuário permitiu notificações.");
        this.pushService.sendSubscriptionToTheServer(subscription).subscribe();
      })
      .catch((err) => {
        console.error("Usuário recusou ou Navegador não suporta", err);
      });
  }

  ngOnInit(): void {
    this.subscribeToNotificationClicks();
  }

  subscribeToNotificationClicks(): void {
    this.swPush.notificationClicks.subscribe((result) => {
      alert("Usuário clicou na ação " + result.action);
    });
  }
}
