export function phoneFormat(number) {
  if(number){
    var numbers = number.replace(/\D/g, ''),
      char = {0: '(', 3: ') ', 6: ' - '};
    number = '';
    for(var i = 0; i < numbers.length; i++){
      number += (char[i] || '') + numbers[i];
    }
  }
  return number;
}

export function deFormat(number){
  return number.replace(/\D/g,'');
}
