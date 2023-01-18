((window, document) => {
    // contains DOM utilities
    const DomUtils = {
      getElementsBy(selector) {
        return document.querySelectorAll(selector);
      },
      getContent(el) {
        return el.innerText;
      },
      setContent(el, value) {
        el.innerText = value;
      }
    };

    class Calculator {
      static SAFE_OPERATORS = ['/', '*', '+', '-'];

      constructor() {
        this.clear();
      }

      /**
       * @return {string}
       */
      clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operator = '';

        return this.currentOperand;
      }

      /**
       * @param char
       * @return {string}
       */
      append(char) {
        const isDot = char === '.';
        // prevent double .
        if (isDot && this.currentOperand.includes('.')) {
          return this.currentOperand;
        }

        if (this.currentOperand === '0') {
          this.currentOperand = isDot ? this.currentOperand + char : char;
        } else {
          this.currentOperand += char;
        }

        return this.currentOperand;
      }

      /**
       * @return {string|number}
       */
      invert() {
        this.currentOperand = (-1 * this.currentOperand).toString();
        return this.currentOperand;
      }

      /**
       * @return {string}
       */
      percent() {
        if (this.currentOperand !== '0') {
          this.currentOperand = (this.currentOperand / 100).toFixed(2).toString();
        }
        return this.currentOperand;
      }

      /**
       * @param operator
       * @return {string | undefined}
       */
      calculate(operator) {
        if (!Calculator.SAFE_OPERATORS.includes(operator)) return;

        if (this.previousOperand !== '') {
          this.compute();
        }

        this.operator = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';

        return this.currentOperand;
      }

      compute() {
        let answer = '0';
        try {
          answer = eval([this.previousOperand, this.operator, this.currentOperand].join(''));
        } catch(e) {
          console.error('Computation error ', e.message);
        } finally {
          this.currentOperand = answer;
          this.operator = '';
          this.previousOperand = '';
        }
        return this.currentOperand;
      }

    }

    function handlePageLoad() {
      const {getElementsBy, getContent, setContent} = DomUtils;

      const handleCalculation = (button) => {
        toggleOpBtnState(button);

        const {operator} = button.dataset;

        let answer = operator === 'equal'
          ? calculator.compute()
          : calculator.calculate(operatorsMap[operator]);

        if (!answer) return;
        if (answer === Infinity) {
          answer = 'Not a number';
        } else if (answer % 1 !== 0) {
          answer = Number(answer).toFixed(6)
        }

        render(answer);
      }

      const updateResultView = (selector) => {
        const resultContainer = getElementsBy(selector)[0];
        return (value) => {
          setContent(resultContainer, value);
        }
      }

      const toggleOpBtnState = (el) => {
        const activeBtn = getElementsBy('span.clicked');
        activeBtn.forEach(btn => btn.classList.remove('clicked'));
        if (el) {
          el.classList.add('clicked');
        }
      }

      const charButtons = getElementsBy('[data-char]');
      const modifierButtons = getElementsBy('[data-modifier]');
      const operatorButtons = getElementsBy('[data-operator]');

      const render = updateResultView('#output');

      const operatorsMap = {
        'add': "+",
        'equal': "=",
        "subtract": "-",
        "divide": "/",
        "multiply": "*"
      };

      const calculator = new Calculator();

      charButtons.forEach(button => {
        button.addEventListener('click', () => {
          render(calculator.append(getContent(button)));
        });
      });

      modifierButtons.forEach(button => {
        button.addEventListener('click', () => {
          toggleOpBtnState();

          const {modifier} = button.dataset;
          switch (modifier) {
            case 'reset':
              return render(calculator.clear());
            case 'invert':
              return render(calculator.invert());
            case 'percent':
              return render(calculator.percent());
          }
        });
      });

      operatorButtons.forEach(button => {
        button.addEventListener('click', () => handleCalculation(button));
      });
    }

    if (typeof window === 'undefined') {
      throw new Error(`Window object not found, application only works in browser environment`);
    }

    window.addEventListener('load', handlePageLoad);
  }
)
(window, document);
