export class diversFun {
  convertDate(inputFormat) {
    function pad(s) {
      return (s < 10) ? `0${s}` : s;
    }
    const d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }

  getImg(codeAno) {
    let output = '';
    switch (codeAno) {
      case "LIVCFM":
        output = 'images/ICO/ico_liv_v.svg';
        break;
      case "RAMCFM":
        output = 'images/ICO/ico_ram_v.svg';
        break;
      case "ECHCFM":
        output = 'images/ICO/ico_ram_v.svg';
        break;
      default:
        output = 'images/ICO/ico_liv_a.svg';
    }
    return output;
  }

  getTime(date) {
    try {
      const part = date.split(' ');
      const partstime = part[1].split(':');
      return `${partstime[0]}:${partstime[1]}`;
    } catch (e) {
      return "#error";
    }
  }

  getClassColor(codeAno) {
    let output;
    switch (codeAno) {
      case "LIVCFM":
        output = 'green';
        break;
      case "RAMCFM":
        output = 'green';
        break;
      case "ECHCFM":
        output = 'green';
        break;
      case "pack":
        output = 'purple';
        break;
      default:
        output = 'red';
    }
    return output;
  }

  getIco(codeAno) {
    let output;
    switch (codeAno) {
      case "LIVCFM":
        output = '<i class="fa fa-check" aria-hidden="true"></i> ';
        break;
      case "RAMCFM":
        output = '<i class="fa fa-check" aria-hidden="true"></i> ';
        break;
      case "ECHCFM":
        output = '<i class="fa fa-check" aria-hidden="true"></i> ';
        break;
      case "pack":
        output = '<i class="fa fa-suitcase" aria-hidden="true"></i> ';
        break;
      case "nogps":
        output = '<i class="fa fa-map" aria-hidden="true"></i> ';
        break;
      default:
        output = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ';
    }
    return output;
  }
}
