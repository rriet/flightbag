import { ApplicationRef, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class ThemingService {
  theme = new BehaviorSubject("light-theme"); // <- initial theme

  constructor(private ref: ApplicationRef) {
    // Initially check if dark mode is enabled on system
    const darkModeOn =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // If dark mode is enabled then directly switch to the dark-theme
    if(darkModeOn){
      this.theme.next("dark-theme");
    }

    // Watch for changes of the preference
    window.matchMedia("(prefers-color-scheme: dark)").addListener(e => {
      const turnOn = e.matches;
      this.theme.next(turnOn ? "dark-theme" : "light-theme");

      // Trigger refresh of UI
      this.ref.tick();
    });
  }
}