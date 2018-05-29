import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the TranslationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TranslationProvider {
  apiKey = "AIzaSyBPlEoTRA4huLmAf_Zoo9v7xTCFFwZOyZ0";
  private data: any;
  endpoints = {
    translate: "",
    detect: "detect",
    languages: "languages"
  };

  constructor(public http: HttpClient) {
    console.log('Hello TranslationProvider Provider');
    
  }
  // Abstract API request function
  makeApiRequest(endpoint, data, type, authNeeded) {
    let url = "https://www.googleapis.com/language/translate/v2/" + endpoint;
    url += "?key=" + this.apiKey;

    // If not listing languages, send text to translate
    if (endpoint !== this.endpoints.languages) {
      url += "&q=" + encodeURI(data.textToTranslate);
    }

    // If translating, send target and source languages
    if (endpoint === this.endpoints.translate) {
      url += "&target=" + data.targetLang;
      url += "&source=" + data.sourceLang;
    }

    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(url).map(res => {
        console.log(res);
      }).subscribe(data => {
        console.log(data);
        this.data = data;
        resolve(this.data);
      });
    });
  }

  // Translate
  translate(data) {
    this.makeApiRequest(this.endpoints.translate, data, "GET", false).then((resp) => {
      console.log(resp.data.translations[0].translatedText);
    }).catch((error) => {
      console.log(error);
    });
  }

  // Detect language
  // detect(data) {
  //   this.makeApiRequest(this.endpoints.detect, data, "GET", false).then((resp) => {
  //     let source = resp.data.detections[0][0].language;
  //     let conf = resp.data.detections[0][0].confidence.toFixed(2) * 100;

  //     $(".source-lang option")
  //       .filter(function() {
  //         return $(this).val() === source; //To select Blue
  //       })
  //       .prop("selected", true);
  //     $.when(getLanguageNames()).then(function(data) {
  //       $("p.target").text(data[source] + " with " + conf + "% confidence");
  //     });
  //     $("h2.translation-heading").hide();
  //     $("h2.detection-heading, p").show();
  //   });
  // }

  // Get languages
  getLanguages() {
    this.makeApiRequest(this.endpoints.languages, null, "GET", false).then((resp) => {
      // this.getLanguageNames().then(function(data) {
      //   $.each(resp.data.languages, function(i, obj) {
      //     $(".source-lang, .target-lang").append(
      //       '<option value="' +
      //         obj.language +
      //         '">' +
      //         data[obj.language] +
      //         "</option>"
      //     );
      //   });
      // });
      let someArray = [1, "string", false];
      for (let entry of someArray) {
        console.log(entry); // 1, "string", false
      }
    });
  }

  // Convert country code to country name
  getLanguageNames() {
    return new Promise(resolve => {
      this.http.get("https://api.myjson.com/bins/155kj1").map(res => {
        console.log(res);
      }).subscribe(data => {
        console.log(data);
        this.data = data;
        resolve(this.data);
      });
    });
  }

  // On document ready
  // $(function() {
  //   window.makeApiRequest = makeApiRequest;
  //   var translationObj = {};

  //   // Popuplate source and target language dropdowns
  //   getLanguages();

  //   $(document)
  //     // Bind translate function to translate button
  //     .on("click", "button.translate", function() {
  //       translationObj = {
  //         sourceLang: $(".source-lang").val(),
  //         targetLang: $(".target-lang").val(),
  //         textToTranslate: $("textarea").val()
  //       };

  //       if (translationObj.targetLang !== null) {
  //         translate(translationObj);
  //       } else {
  //         alert("Please select a target language");
  //       }
  //     })
  //     // Bind detect function to detect button
  //     .on("click", "button.detect", function() {
  //       translationObj = {
  //         textToTranslate: $("textarea").val()
  //       };

  //       detect(translationObj);
  //     });
  // });
}
