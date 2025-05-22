/**
 * Button authoring patterns
 * @type {Array}
 */
const btnPatterns = [
    {
      style: 'primary',
      elTree: ['STRONG'],
      pattern: {
        exp: /\[(.*?)\]/,
        check: (text) => text.charAt(0) === '[',
      },
    },
    {
      style: 'secondary',
      elTree: [],
      pattern: {
        exp: /\[\[(.*?)\]\]/,
        check: (text) => text.charAt(1) === '[',
      },
    },
    {
      style: 'tertiary',
      elTree: [],
      pattern: {
        exp: /\[\[\[(.*?)\]\]\]/,
        check: (text) => text.charAt(2) === '[',
      },
    },
    {
      style: 'outline',
      elTree: ['STRONG', 'EM'],
      pattern: {
        exp: /\[\((.*?)\)\]/,
        check: (text) => text.charAt(1) === '(',
      },
    },
  ];
  
  /**
   * Decorates a button
   * @param {Element} a button element
   */
  function makeBtn(a) {
    a.title = a.title || a.textContent;
    const up = a.parentElement;
    const upup = a.parentElement.parentElement;
    let btnStyle = 'link';
    const authored = btnPatterns.reduce((match, { pattern, elTree, style }) => {
      const textAuth = pattern.check(a.innerText);
      const tree = [up.tagName, upup.tagName].filter((el) => ['STRONG', 'EM'].includes(el));
      const inTree = elTree.length && elTree.every((el) => tree.includes(el));
      if (textAuth || inTree) match.push({ style, replace: textAuth && pattern.exp });
      return match;
    }, [])?.pop();
    if (authored) {
      btnStyle = `button ${authored.style}`;
      if (authored.replace) {
        const matchText = a.innerHTML.split(authored.replace);
        const text = matchText[1];
        a.innerHTML = text.trim();
        a.title = a.title.charAt(0) === '[' ? a.title.split(authored.replace)[1]?.trim() : a.title;
      }
    }
    a.className = btnStyle;
  }
  
  /**
   * Decorates button containers
   * @param {Element} links container element
   */
  function cleanup(links) {
    links.forEach((a) => {
      const parent = a.closest('p');
      const siblings = parent?.querySelectorAll('a');
      if (siblings?.length === 1) {
        parent?.classList?.add('button-container');
        parent?.replaceChildren(a);
      } else if (!parent?.classList?.contains('button-group')) {
        parent?.classList?.add('button-group');
        parent?.replaceChildren(...siblings);
      }
    });
  }
  
  /**
   * Decorates paragraphs containing a single link as buttons.
   * @param {Element} element container element
   */
  export default function decorate(element) {
    const links = element.querySelectorAll('a');
    [...links].filter((link) => link.href !== link.textContent && !link.querySelector('img')).forEach((a) => makeBtn(a));
    cleanup(links);
  }
  