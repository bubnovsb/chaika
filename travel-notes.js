/* Public travel advice is added only after the existing book has been unlocked.
   The encrypted itinerary and the access-code mechanism are left unchanged. */
(() => {
  'use strict';

  const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  const sources = {
    nihao: 'https://www.unionpayintl.com/ZT/en/NHCAPP/',
    rshb: 'https://www.rshb.ru/news/20022026-000003',
    rshbGuide: 'https://www.rshb.ru/api/v1/storage/f6a42033-a520-44b4-8997-1684d1037242/attachment',
    metro: 'https://www.metroman.cn/en/apps',
    yandex: 'https://yandex.ru/support/translate-app-android/ru/offline-mobile',
    google: 'https://support.google.com/translate/answer/6142473?hl=ru',
    apple: 'https://www.apple.com/legal/privacy/data/en/apple-maps/',
    shMetro: 'https://www.shanghai.gov.cn/xbhygq/20231206/646ef8c98d8b4b0995177dd8c71d595c.html',
    shBus: 'https://english.shanghai.gov.cn/en-Individuals-Transportation-PublicTransport/20260813/38f3af48ba0049239f6908846ab0a9c7.html',
    rail: 'https://www.12306.cn/en/faq.html?item=1',
    railDates: 'https://hzfw.12306.cn/zgzfw/resources/h5/ysqcx-h5.html',
    caac: 'https://www.caac.gov.cn/English/News/202507/t20250709_227894.html',
    batteries: 'https://www.csair.com/newh5/en/tourguide/luggage_service/carryon_luggage/lithium_battery/',
    icao: 'https://www.icao.int/zh-hans/filebrowser/download/92841?fid=92841',
    ccc: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/rzjgs/art/2025/art_89a9cba1f9664173a093d04e07647d09.html'
  };

  const css = `
    .travel-note{border-top:1px solid var(--ink);padding:24px 0;margin-top:32px}
    .travel-note .eyebrow{color:var(--seal);margin-bottom:12px}
    .travel-note>p+p{margin-top:12px}
    .travel-note h3{margin-bottom:14px}
    .travel-note p{max-width:76ch;color:var(--ink-2)}
    .travel-note a,.travel-sources a{color:var(--porcelain);text-underline-offset:4px}
    .travel-sources{font-size:12.5px;color:var(--ink-2);line-height:1.7;margin-top:20px;max-width:90ch}
    .travel-details{margin-top:24px;border-block:1px solid var(--line)}
    .travel-details summary{cursor:pointer;padding:18px 0;font:400 26px/1.2 var(--display);color:var(--ink)}
    .travel-details summary:focus-visible{outline:2px solid var(--porcelain);outline-offset:4px}
    .travel-steps{list-style:none;counter-reset:travel-step;padding:0;margin:12px 0 24px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 40px}
    .travel-steps li{counter-increment:travel-step;position:relative;padding-left:42px;min-width:0}
    .travel-steps li::before{content:counter(travel-step,decimal-leading-zero);position:absolute;left:0;top:0;font:400 26px/1 var(--display);color:var(--seal)}
    .travel-steps b{font:400 23px/1.2 var(--display)}
    .travel-steps p{margin-top:8px;font-size:16px;line-height:1.6;color:var(--ink-2)}
    .travel-section .han{font-family:var(--brush);font-size:clamp(64px,10vw,140px);line-height:1;color:var(--ink)}
    .travel-section .travel-details{max-width:100%}
    @media(max-width:680px){.travel-steps{grid-template-columns:1fr;gap:24px}.travel-details summary{font-size:24px}.travel-section .chapter-head{grid-template-columns:1fr}}
  `;

  function fragment(doc, html) {
    const template = doc.createElement('template');
    template.innerHTML = html;
    return template.content;
  }

  function section(doc, id, han, eyebrow, title, lead, body) {
    return fragment(doc, `<section id="${id}" class="travel-section" data-chapter>
      <div class="wrap"><div class="chapter-head">
        <div class="han" aria-hidden="true">${han}</div>
        <div class="t"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p class="lead">${lead}</p></div>
      </div>${body}</div></section>`);
  }

  function guideItem(doc, title, body) {
    return fragment(doc, `<li><b>${title}</b><p>${body}</p></li>`);
  }

  function replaceGuide(doc, parent, title, body) {
    const item = Array.from(parent.querySelectorAll('.guide li')).find(li => li.querySelector('b')?.textContent.trim() === title);
    if (item) item.querySelector('p').innerHTML = body;
    return item;
  }

  function prepare(doc) {
    const apps = doc.querySelector('#apps');
    const money = doc.querySelector('#money');
    const taxi = doc.querySelector('#taxi');
    if (!apps || !money || !taxi) return false;

    apps.querySelector('h2').textContent = 'Приложения для поездки';
    apps.querySelector('.lead').textContent = 'Установите нужное дома, войдите в аккаунты и скачайте офлайн-данные. На месте останется только выбрать маршрут.';
    apps.querySelector('.apps').append(fragment(doc, `
      <div class="app"><div class="ico" style="background:var(--seal)">你好</div><h3>Nihao China</h3><p>Ещё один способ платить по QR с поддерживаемой картой UnionPay. Особенно полезно, если у вас карта Россельхозбанка.</p><small><a href="#nihao">Настроить пошагово ↓</a></small></div>
      <div class="app"><div class="ico" style="background:var(--porcelain)">M</div><h3>MetroMan</h3><p>Схемы метро и маршруты без интернета. Загрузите Пекин и Шанхай заранее и проверьте маршрут в авиарежиме.</p><small>${link(sources.metro, 'Сайт разработчика')}</small></div>
    `));
    const alipay = Array.from(apps.querySelectorAll('.app')).find(app => app.querySelector('h3')?.textContent === 'Alipay');
    if (alipay) alipay.querySelector('p').textContent = 'Оплата по QR с поддерживаемой картой, транспорт и DiDi. Привязка карты не означает, что пройдут все платежи: проверьте условия банка и приложения.';

    apps.after(section(doc, 'navigation', '路', 'Не потеряться', 'Карты и перевод',
      'Для прогулки — местная карта. Для метро — сохранённая схема. Для разговора — переводчик, который вы уже проверили без сети.', `
      <ul class="guide">
        <li><b>Amap · 高德地图</b><p>Основную навигацию по городу оставьте Amap: ищите места по китайскому названию или адресу из наших карточек. Если в вашей версии есть английский интерфейс, включите его в настройках.</p></li>
        <li><b>Baidu Maps и Apple Maps</b><p>Baidu Maps (百度地图) — дополнительная местная карта, преимущественно на китайском. На iPhone можно пользоваться Apple Maps: в материковом Китае они используют данные Amap. Не рассчитывайте, что офлайн-загрузка доступна для каждого региона.</p></li>
        <li><b>Запасной маршрут</b><p>Google Maps не делайте единственным навигатором в Китае. Яндекс Карты, Organic Maps и MAPS.ME оставьте как дополнение; конкретный адрес и транспортный маршрут сверяйте в местной карте. Сохраните скриншоты дороги к отелю.</p></li>
        <li><b>Перевод без интернета</b><p>В Яндекс Переводчике или Google Translate заранее загрузите доступные пакеты русского и китайского языков, при необходимости английского. Проверьте текст и камеру в авиарежиме: у Яндекса офлайн доступен только введённый текст, голос и диалог требуют сети.</p></li>
      </ul>
      <div class="travel-note"><p class="eyebrow">Маленькая подготовка</p><p>Сохраните китайские названия отелей и мест в заметках. Для меню и вывесок пригодится перевод по фото; для онлайн-перевода можно также использовать Baidu Translate. Не отправляйте в переводчики и чат-боты паспорт, реквизиты карты и коды подтверждения.</p></div>
      <p class="travel-sources">Офлайн-функции: ${link(sources.yandex, 'Яндекс')}, ${link(sources.google, 'Google')}. Данные карт: ${link(sources.apple, 'Apple')}. Доступность функций зависит от устройства и версии приложения.</p>
    `));

    money.querySelector('.lead').textContent = 'Готовим два способа оплаты: приложение с поддерживаемой картой и наличные юани в резерве. Один не должен зависеть от другого.';
    const firstPayment = replaceGuide(doc, money, 'Alipay с иностранной картой', 'Российские Visa, Mastercard и «Мир» для обычной оплаты в Китае не подходят. Если есть поддерживаемая карта другой страны, добавьте её в Alipay или WeChat Pay. Комиссии, лимиты и подтверждение личности уточните в приложении; условия зависят от банка.');
    const unionpay = guideItem(doc, 'Российская UnionPay — не все одинаковы', `Россельхозбанк официально поддерживает оплату через Nihao China своей картой UnionPay. Для карт других банков, в том числе АТБ, заранее уточните поддержку именно вашей карты и способ привязки. Не считайте логотип UnionPay гарантией работы в каждом сервисе. ${link(sources.rshb, 'Информация РСХБ')}`);
    if (firstPayment) firstPayment.after(unionpay);
    else money.querySelector('.guide').append(unionpay);
    money.querySelector('.guide').append(guideItem(doc, 'Без случайных посредников', 'Не переводите деньги частным лицам из сообщений с обещанием «пополнить Alipay без риска». Привязка своей карты и перевод через посредника — разные вещи. Не передавайте никому SMS-коды, платёжный пароль и данные карты; при проблеме обращайтесь в банк или поддержку приложения.'));

    money.querySelector('.wrap').append(fragment(doc, `<div id="nihao" class="travel-note">
      <p class="eyebrow">UnionPay · Настроить дома</p><h3>Nihao China: от установки до оплаты</h3>
      <p>Устанавливайте приложение из App Store или Google Play по ссылкам с ${link(sources.nihao, 'сайта UnionPay')}. Держите под рукой телефон, привязанный к карте: на него придёт SMS. Названия кнопок могут немного отличаться в разных версиях.</p>
      <details class="travel-details"><summary>Шесть шагов настройки</summary><ol class="travel-steps">
        <li><b>Установить приложение</b><p>Найдите Nihao China в официальном магазине. Проверьте название и разработчика через сайт UnionPay, не устанавливайте файл из личных сообщений.</p></li>
        <li><b>Зарегистрироваться</b><p>Выберите вход по телефону или email, подтвердите код и ознакомьтесь с условиями. Для UnionPay РСХБ банк рекомендует тот же номер, который привязан к карте.</p></li>
        <li><b>Добавить карту</b><p>Откройте «Оплата / Pay» → «Добавить способ оплаты» → «Добавить карту» или кнопку «+». Выберите привязку поддерживаемой иностранной UnionPay.</p></li>
        <li><b>Подтвердить данные</b><p>Введите данные карты и банковский номер телефона, затем SMS-код — только в самом приложении. У РСХБ при активации списывается 1 ¥: оставьте средства на счёте.</p></li>
        <li><b>Задать платёжный пароль</b><p>Создайте шестизначный пароль и сохраните его безопасно. Это отдельный пароль приложения, не PIN вашей банковской карты. Не сообщайте его другим людям.</p></li>
        <li><b>Выбрать способ оплаты</b><p>«Pay» показывает ваш QR продавцу, «Scan» считывает QR магазина. Не каждый платёж может пройти; если отказано, используйте резерв. Для транспорта откройте «Metro/Bus» и активируйте нужный город.</p></li>
      </ol></details>
      <p class="travel-sources">Основа инструкции: ${link(sources.nihao, 'UnionPay')} и ${link(sources.rshbGuide, 'памятка РСХБ')}. Поддержку карты, комиссии и получение SMS в роуминге проверьте перед поездкой.</p>
    </div>`));

    taxi.querySelector('h2').textContent = 'Такси, метро и поезда';
    taxi.querySelector('.lead').textContent = 'Китайский адрес из наших карточек пригодится и в приложении, и водителю. Кнопка «Показать таксисту» выводит его крупными иероглифами на весь экран.';
    replaceGuide(doc, taxi, 'Такси через приложение', 'DiDi (滴滴) можно открыть в Alipay или WeChat либо установить отдельно. Вставьте китайский адрес, проверьте точку подачи и способ оплаты до заказа. Для обычного такси с улицы заранее покажите адрес и уточните оплату наличными; держите мелкие купюры.');
    replaceGuide(doc, taxi, 'Метро', 'В Alipay откройте «Transport / Travel», выберите Пекин или Шанхай и активируйте транспортный код с доступным способом оплаты. Это не обычный QR для покупок. На входе и выходе используйте одно приложение и один аккаунт, код открывайте вживую, не скриншотом. Ближайшие станции: Дэншикоу (линия 5) в Пекине и Shanghai Circus World (линия 1) в Шанхае.');
    const mapsItem = replaceGuide(doc, taxi, 'Карты', 'Подробности о местных картах, переводчиках и подготовке без интернета — в разделе <a href="#navigation">«Карты и перевод»</a>. Выпишите китайский адрес отеля на бумагу: он пригодится, даже если телефон разрядится.');
    if (mapsItem) mapsItem.querySelector('b').textContent = 'Маршрут без сети';
    taxi.querySelector('.guide').append(guideItem(doc, 'Если QR не сработал', 'В метро купите разовый билет за юани в кассе или подходящем автомате: выберите станцию назначения и сохраните билет до выхода. Формат билета и способ прохода зависят от станции. Прямую оплату картой UnionPay у турникета не считайте универсальным вариантом — уточните на месте.'));
    taxi.querySelector('.guide').append(guideItem(doc, 'Автобус', 'Выберите город и автобусный код в транспортном разделе приложения. На маршрутах с фиксированным тарифом обычно сканируют при посадке; на других может понадобиться отметка при выходе — смотрите указания. Если платите наличными, приготовьте точную сумму: в автобусах без кондуктора сдачи нет.'));
    taxi.querySelector('.guide').append(guideItem(doc, 'Междугородний поезд', `Билеты можно купить на ${link('https://www.12306.cn/en/', 'официальном 12306')} или за наличные в кассе; Trip.com — альтернативный сервис бронирования, проверьте сборы. Покупайте на данные загранпаспорта и берите оригинал с собой. Сохраните номер поезда, вагон и место; на станции уточните проход для иностранного паспорта.`));
    taxi.querySelector('.guide').append(guideItem(doc, 'Не перепутать вокзал', `В городе несколько станций: сверяйте полное название отправления, а не только «Пекин» или «Шанхай». Обычное окно продаж — 15 календарных дней, включая день покупки (примерно две недели вперёд); время открытия отличается по станции. ${link(sources.railDates, 'Проверить окно продаж')}`));
    taxi.querySelector('.wrap').append(fragment(doc, `<p class="travel-sources">Транспортные правила: ${link(sources.shMetro, 'метро Шанхая')}, ${link(sources.shBus, 'автобусы Шанхая')}, ${link(sources.rail, 'China Railway 12306')}. Доступность оплаты зависит от города, карты и маршрута.</p>`));

    money.before(section(doc, 'powerbanks', '电', 'Проверить перед аэропортом', 'Пауэрбанк в ручную кладь',
      'На обратном пути у части группы есть внутренний рейс по Китаю. Даже если батарею пропустили на международном перелёте, это не гарантирует допуск на следующем участке.', `
      <ul class="guide">
        <li><b>Внутри Китая — читаемый CCC</b><p>Для внутренних рейсов нужен чёткий знак CCC / 3C на корпусе. Без него, с нечитаемой маркировкой или у отозванной модели / партии устройство не допускают. На международном рейсе отдельно действуют правила перевозчика — обещать, что любой пауэрбанк оставят с вами, нельзя.</p></li>
        <li><b>До 100 Wh включительно</b><p>Обычно отдельное согласование ёмкости не требуется. Не берите больше двух пауэрбанков; у авиакомпании может быть более строгий лимит. Маркировка должна читаться, корпус — без вздутия и повреждений.</p></li>
        <li><b>Больше 100, до 160 Wh</b><p>Не берите без предварительного разрешения авиакомпании: некоторые перевозчики такие пауэрбанки вообще не допускают. Больше 160 Wh в пассажирскую перевозку не берут. Для поездки проще выбрать устройство до 100 Wh.</p></li>
        <li><b>Не в сдаваемый чемодан</b><p>Только ручная кладь, в отдельном чехле с защитой от короткого замыкания. Если сумку забирают в багаж у выхода на посадку, сначала выньте пауэрбанк. На борту не заряжайте ни его, ни телефон от него; соблюдайте указания экипажа.</p></li>
      </ul>
      <div class="travel-note"><p class="eyebrow">Смотреть на Wh, не только на mAh</p><p>Wh — энергоёмкость, а W — мощность зарядки: это разные числа. Например, 20 000 mAh при номинальных 3,7 V — 74 Wh. Ищите заводскую маркировку на корпусе; собственный расчёт не заменяет читаемую этикетку.</p></div>
      <details class="travel-details"><summary>А что с QR-кодом и хранением в аэропорту?</summary>
        <p>Требование CCC для внутренних рейсов уже действует. Реформа CCC с отслеживающим QR относится к выпуску и обороту сертифицированной продукции: этап для новых сертификатов начался 1 марта 2026 года, следующий — 1 марта 2027-го. Это не основание объявлять все старые устройства без QR запрещёнными к полёту сейчас.</p>
        <p style="margin:14px 0 20px">Если устройство не допускают, спросите у службы безопасности о хранении или отправке. Такая услуга, её цена и условия зависят от аэропорта; бесплатную пересылку и возврат не гарантируем. Лучше проверить устройство дома, чем решать это перед посадкой.</p>
      </details>
      <p class="travel-sources">Проверено 4 октября 2026: ${link(sources.caac, 'CAAC · CCC')}, ${link(sources.batteries, 'China Southern · батареи')}, ${link(sources.icao, 'ICAO · лимит пауэрбанков')}, ${link(sources.ccc, 'SAMR · CCC и QR')}. Перед каждым рейсом уточняйте актуальные правила у своего перевозчика.</p>
    `));

    const nav = doc.querySelector('.subnav.page-sub');
    if (nav) {
      nav.querySelector('[href="#apps"]')?.after(fragment(doc, '<a href="#navigation">Карты и перевод</a>'));
      nav.querySelector('[href="#rules"]')?.after(fragment(doc, '<a href="#powerbanks">Пауэрбанк</a>'));
      const transport = nav.querySelector('[href="#taxi"]');
      if (transport) transport.textContent = 'Транспорт';
    }
    return true;
  }

  function flights(doc) {
    const airportGuide = doc.querySelector('#airports .guide');
    const target = airportGuide || doc.querySelector('#airports .wrap');
    if (!target) return false;
    const note = fragment(doc, `<aside class="travel-note" aria-label="Пауэрбанк на пересадке">
      <p class="eyebrow">Важно на обратном пути</p><h3>Внутренний рейс — отдельная проверка</h3>
      <p>Маршруты через Пекин, Ухань и Сиань включают перелёт внутри Китая. Для пауэрбанка нужен читаемый знак CCC; устройство без маркировки или из отозванной партии на внутренний рейс не допускают. Учитывайте правила всех участков, даже если первый перелёт был международным.</p>
      <p><a href="prep.html#powerbanks">Проверить пауэрбанк перед поездкой →</a></p>
    </aside>`);
    if (airportGuide) airportGuide.before(note);
    else target.append(note);
    return true;
  }

  window.SEAGULL_TRAVEL_NOTES = (doc, page) => {
    if (doc.documentElement.hasAttribute('data-travel-notes')) return;
    const changed = page === 'prep' ? prepare(doc) : page === 'flights' ? flights(doc) : false;
    if (!changed) return;
    const style = doc.createElement('style');
    style.textContent = css;
    doc.head.append(style);
    doc.documentElement.setAttribute('data-travel-notes', '20261004');
  };
})();
