const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open(
  "GET",
  "https://twinword-text-classification.p.rapidapi.com/classify/?text=Protect%20your%20back%20with%20these%20ergonomic%20office%20chairs.%20These%20adjustable%20chairs%20are%20cushioned%20and%20molded%20to%20ensure%20comfort%20over%20long%20hours.%20Some%20options%20feature%20breathable%20backs%20that%20let%20air%20flow%20through%20to%20keep%20you%20cool%20and%20add%20to%20your%20comfort%20level%20on%20hot%20days."
);
xhr.setRequestHeader(
  "x-rapidapi-host",
  "twinword-text-classification.p.rapidapi.com"
);
xhr.setRequestHeader(
  "x-rapidapi-key",
  "027cff5cbfmsh439002e33664b4ap1c34c7jsn8622e3b4d4ca"
);

xhr.send(data);

console.log(data);
