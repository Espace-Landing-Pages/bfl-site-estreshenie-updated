const accordionRoots = document.querySelectorAll("[data-accordion]");

accordionRoots.forEach((root) => {
  const items = root.querySelectorAll(".accordion-item");

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      items.forEach((entry) => {
        entry.classList.remove("is-open");
        entry.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
});

const calculatorForm = document.querySelector("#calculator-form");
const resultRange = document.querySelector("#result-range");
const resultSummary = document.querySelector("#result-summary");
const calculatorResponse = document.querySelector("#calculator-response");

const calculatorMatrix = {
  small: 89000,
  medium: 119000,
  large: 149000,
  xlarge: 179000,
};

function formatCurrency(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function calculateRange(formData) {
  const debtBase = calculatorMatrix[formData.get("debtAmount")] ?? 89000;
  const propertyAdjust =
    {
      none: 0,
      car: 15000,
      housing: 22000,
      complex: 32000,
    }[formData.get("propertyRisk")] ?? 0;
  const debtTypeAdjust =
    {
      credits: 0,
      microloans: 10000,
      mixed: 17000,
      business: 26000,
    }[formData.get("debtType")] ?? 0;
  const incomeAdjust =
    {
      stable: 0,
      unstable: 6000,
      none: 9000,
    }[formData.get("income")] ?? 0;

  const lower = debtBase + Math.round((propertyAdjust + debtTypeAdjust + incomeAdjust) * 0.4);
  const upper = lower + 48000 + propertyAdjust;

  let summary =
    "Для типовой ситуации без сложного имущества обычно можно говорить о спокойном поэтапном сопровождении.";

  if (formData.get("propertyRisk") === "housing" || formData.get("propertyRisk") === "complex") {
    summary =
      "В вашей ситуации особенно важен персональный разбор по имуществу и документам до финального вывода по стоимости.";
  } else if (formData.get("debtType") === "business") {
    summary =
      "Когда долг связан с бизнесом или поручительством, предварительный ориентир лучше обсуждать после анализа документов и истории обязательств.";
  } else if (formData.get("debtType") === "microloans") {
    summary =
      "Для ситуаций с микрозаймами особенно важно быстро собрать полную картину по всем обязательствам и кредиторам.";
  }

  return { lower, upper, summary };
}

if (calculatorForm && resultRange && resultSummary) {
  const updateCalculator = () => {
    const formData = new FormData(calculatorForm);
    const { lower, upper, summary } = calculateRange(formData);

    resultRange.textContent = `от ${formatCurrency(lower)} до ${formatCurrency(upper)}`;
    resultSummary.textContent = summary;
  };

  calculatorForm.addEventListener("change", updateCalculator);

  calculatorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateCalculator();
    calculatorResponse.textContent =
      "Спасибо. Предварительный ориентир обновлен на экране. Для точного расчета нужен персональный разбор ситуации.";
  });
}

const leadForm = document.querySelector("#lead-contact-form");
const leadResponse = document.querySelector("#lead-response");

if (leadForm && leadResponse) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    leadResponse.textContent =
      "Заявка принята. В рабочей версии сайта здесь можно подключить CRM, почту или мессенджер компании.";
  });
}

const heroSection = document.querySelector("#hero");
const stickyClose = document.querySelector("#sticky-cta-close");

function dismissSticky() {
  document.body.classList.remove("show-sticky");
  document.body.classList.add("sticky-dismissed");
}

if (stickyClose) {
  stickyClose.addEventListener("click", dismissSticky);
}

if (heroSection && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!document.body.classList.contains("sticky-dismissed")) {
        document.body.classList.toggle("show-sticky", !entry.isIntersecting);
      }
    },
    { threshold: 0.18 }
  );

  observer.observe(heroSection);
}
