describe('Timestamps', function(){
  beforeEach(function(){

  })

  afterEach(function(){

  })

  it('secondsToTimestamp(95.289251) is 00:01:35.289', function(){
    expect(secondsToTimestamp(95.289251)).toBe('00:01:35.289');
  })

  it('convertRange(139.284997, 143.284897) is "00:02:19.285 --> 00:02:23.285"', function(){
     ;
    var startTime = 139.284997;
    var endTime = 143.284897;

    var timing = '00:02:19.285 --> 00:02:23.285';

    expect(convertRange(startTime, endTime)).toEqual(timing) 

  })

  
})
