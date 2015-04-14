describe('View', function(){
  beforeEach(function(){
    this.wrapper = document.createElement('div');
    this.wrapper.id = 'wrapper';
    document.body.appendChild(this.wrapper);
  })

  afterEach(function(){
    this.wrapper = document.querySelector('#wrapper');
    this.wrapper.remove();
  })

  it('can make a dom node', function(){
    expect(document).not.toBe(null);
  })

  it('can add real nodes', function(){
    expect(typeof this.wrapper.innerHTML).toBe('string');
  })

  
})
