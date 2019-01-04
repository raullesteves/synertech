const masks = {

    telefone: campo => {
      const regras = [/\d+/gi, /^(\d\d?)/, /^(\d\d)(\d{4})-?(\d{1,4})/, /^(\d\d)(\d{5})-?(\d{1,4})/];
      const valores = campo.value.match(regras[0]);
      if (!valores) return campo.value = '';
      const valor = campo.value = valores.join('');
      if (valor.length > 0) campo.value = valor.replace(regras[1], '($1');
      if (valor.length > 2) campo.value = valor.replace(regras[1], '($1) ');
      if (valor.length > 6) campo.value = valor.replace(regras[2], '($1) $2-$3');
      if (valor.length > 10) campo.value = valor.replace(regras[3], '($1) $2-$3');
      if (valor.length > 11) campo.value = campo.value.substr(0, 15);
    },
  
    cpf: campo => {
      const numeros = /\d+/gi;
      const valores = campo.value.match(numeros);
      if (!valores) return campo.value = '';
      const valor = valores.join('');
      const cpf = /^([0-9]{1,3})?\.?([0-9]{1,3})?\.?([0-9]{1,3})?-?([0-9]{1,2})?$/;
      const cnpj = /^([0-9]{1,2})?\.?([0-9]{1,3})?\.?([0-9]{1,3})?\/?([0-9]{1,4})?-?([0-9]{1,2})?$/;
      campo.value = campo.value.replace(/[^\d./-]/gi, '');
      if (cpf.test(valor)) campo.value = valor.replace(cpf, (all, a, b, c, d) => {
        return (a || '') + (b ? '.' + b : '') + (c ? '.' + c : '') + (d ? '-' + d : '');
      });
      else if (cnpj.test(valor)) campo.value = valor.replace(cnpj, (all, a, b, c, d, e) => {
        return (a || '') + (b ? '.' + b : '') + (c ? '.' + c : '') + (d ? '/' + d : '') + (e ? '-' + e : '');
      });
      if (campo.value.length > 18) campo.value = campo.value.substr(0, 18);
    },
  
    data: campo => {
      if (campo.type === 'date') return;
      const numeros = campo.value.replace(/^0?\/|[^\d/]/gi, '');
      if (numeros === '') {
        campo.value = numeros;
        campo.style.borderColor = null;
        return;
      }
      campo.value = numeros
        .replace(/(^|\/)00+\/?/g, '0')
        .replace(/(^|\/)([1-9]\/)/, '0$2')
        .replace(
          /(\d\d)(\/?)(\d{1,2})?(\/?)0*(\d{1,4})?.*/g,
          function (all, dd, s1, mm, s2, aaaa) {
            if (dd > 31 || mm > 12) campo.style.borderColor = 'red';
            else campo.style.borderColor = null;
            return dd + (mm ? '/' + mm : s1 || '') + (aaaa ? '/' + aaaa : s2 || '');
          }
        );
    },
  
    numeros: campo => {
      if (!/^[0-9]+$/.test(campo.value)) {
        campo.value = campo.value.substring(0, campo.value.length - 1);
      }
    }
  
  }
  
  export default masks;