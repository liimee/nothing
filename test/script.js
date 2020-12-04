class button {
  constructor(opts) {
    this.txt = opts.content;
    this.onc = opts.onclk;
  }
  
  static function() {
    document.createElement('button');
  }
}