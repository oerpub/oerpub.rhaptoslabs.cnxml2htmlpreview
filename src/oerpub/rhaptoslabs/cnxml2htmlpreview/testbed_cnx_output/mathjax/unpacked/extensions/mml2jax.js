/*************************************************************
 *
 *  MathJax/extensions/mml2jax.js
 *  
 *  Implements the MathML to Jax preprocessor that locates <math> nodes
 *  within the text of a document and replaces them with SCRIPT tags
 *  for processing by MathJax.
 *
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2010 Design Science, Inc.
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

MathJax.Extension.mml2jax = {
  varsion: "1.0.1",
  config: {
    element: null,          // The ID of the element to be processed
                            //   (defaults to full document)

    preview: "alttext"      // Use the <math> element's alttext as the 
                            //   preview.  Set to "none" for no preview,
                            //   or set to an array specifying an HTML snippet
                            //   to use a fixed preview for all math

  },
  MMLnamespace: "http://www.w3.org/1998/Math/MathML",
  
  PreProcess: function (element) {
    if (!this.configured) {
      MathJax.Hub.Insert(this.config,(MathJax.Hub.config.mml2jax||{}));
      if (this.config.Augment) {MathJax.Hub.Insert(this,this.config.Augment)}
      this.configured = true;
    }
    if (typeof(element) === "string") {element = document.getElementById(element)}
    if (!element) {element = this.config.element || document.body}

    var math2 = element.getElementsByTagName("math"), i;
    // IE arrays returned from getElementsByTagName aren't real arrays.
    // IE will update (remove) elements when they are changed.
    var math = [];
    for (i = math2.length-1; i >= 0; i--) { math.push(math2[i]); }

    //Convert all the MML elements with prefixes:
    var prefixes = [ "m", "mml" ];
    for (var p in prefixes) {
      var math2 = element.getElementsByTagName(prefixes[p] + ":math");
      for (i = math2.length-1; i >= 0; i--) { math.push(math2[i]); }
      math2 = element.getElementsByTagName((prefixes[p] + ":math").toUpperCase());
      for (i = math2.length-1; i >= 0; i--) { math.push(math2[i]); }
    }

    if (math.length === 0 && element.getElementsByTagNameNS)
      {math = element.getElementsByTagNameNS(this.MMLnamespace,"math")}
    if (this.msieMathTagBug) {
      for (i = math.length-1; i >= 0; i--) {
        if (math[i].nodeName.match(/(\w+:)?MATH/g)) {this.msieProcessMath(math[i])}
                                    else {this.ProcessMath(math[i])}
      }
    } else {
      for (i = math.length-1; i >= 0; i--) {this.ProcessMath(math[i])}
    }
  },
  
  ProcessMath: function (math) {
    var parent = math.parentNode;
    var script = document.createElement("script");
    script.type = "math/mml";
    parent.insertBefore(script,math);
    var span = MathJax.HTML.Element("span"); span.appendChild(math);
    var html = span.innerHTML;
    html = html.replace(/&lt;/g, "&amp;lt;");
//    if (this.msieScriptBug) {
      html = html.replace(/<\?import .*?>/,"").replace(/<\?xml:namespace .*?\/>/,"");
      html = html.replace(/<(\/?)\w+:/g,"<$1").replace(/&nbsp;/g,"&#xA0;");
      html = html.replace(/ class=(\w+)/g,' class="$1"');
      html = html.replace(/ xmlns(:\w+)?="[\w:\/\.]+"/g,"");
      html = html.replace(/<math\ /g,'<math xmlns="' + this.MMLnamespace + '" ');
      html = html.replace(/<(\/?)([A-Z]+)/g, this.toLowerCase);
      html = html.replace(/&/g, '&amp;');
      script.text = html;
//    } else {
//      MathJax.HTML.addText(script,html);
//    }
    if (this.config.preview !== "none") {this.createPreview(math,script)}
  },
  
  msieProcessMath: function (math) {
    var parent = math.parentNode;
    if(!parent) return;
    var script = document.createElement("script");
    script.type = "math/mml";
    parent.insertBefore(script,math);
    var mml = "";
    while (math && !math.nodeName.match(/\/(\w+:)?MATH/g)) {
      if (math.nodeName === "#text" || math.nodeName === "#comment")
        {mml += math.nodeValue.replace(/&/g,"&#x26;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
        else {mml += this.toLowerCase(math.outerHTML.replace(/<(\/?)\w+:/g,"<$1"))}
      var node = math;
      math = math.nextSibling;
      node.parentNode.removeChild(node);
    }
    mml = mml.replace(/=" ([a-zA-Z])/g, '="" $1'); //IE7 drops the last quote when an attribute is empty
    mml = mml.replace(/=">/g, '="">');
    mml = mml.replace(/ class=(\w+)/g,' class="$1"'); //IE7 dropes the quotes around the class attribute
    mml = mml.replace(/ xmlns(:\w+)?="[\w:\/\.]+"/g,""); //Remove unneccesary and confusing xmlns declarations when stripping the prefix (maybe unnecessary)
    mml = mml.replace(/<math\ /g,'<math xmlns="' + this.MMLnamespace + '" '); //Add in the MathML namespace (maybe unneccesary)
    if (math && math.nodeName.match(/\/(\w+:)?MATH/g)) {math.parentNode.removeChild(math)}
    script.text = mml + "</math>";
    if (this.config.preview !== "none") {this.createPreview(math,script)}
  },
  toLowerCase: function (string) {
    var parts = string.split(/"/);
    for (var i = 0, m = parts.length; i < m; i += 2) {parts[i] = parts[i].toLowerCase()}
    return parts.join('"');
  },
  
  createPreview: function (math,script) {
    var preview;
    if (math && this.config.preview === "alttext") {
      var text = math.getAttribute("alttext");
      if (text != null) {preview = [this.filterText(text)]}
    } else if (this.config.preview instanceof Array) {preview = this.config.preview}
    if (preview) {
      preview = MathJax.HTML.Element("span",{className:MathJax.Hub.config.preRemoveClass},preview);
      script.parentNode.insertBefore(preview,script);
    }
  },
  
  filterText: function (text) {return text}

};

MathJax.Hub.Browser.Select({
  MSIE: function (browser) {
    MathJax.Hub.Insert(MathJax.Extension.mml2jax,{
      msieScriptBug: true,
      msieMathTagBug: true
    })
  }
});
  
MathJax.Hub.Register.PreProcessor(["PreProcess",MathJax.Extension.mml2jax]);
MathJax.Ajax.loadComplete("[MathJax]/extensions/mml2jax.js");
