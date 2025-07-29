export default class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this._url = this.getAttribute('api');
    this.check = this.getAttribute('check');
    this.countryCodes = [
        { name: 'Afghanistan', code: 'AF', dial_code: '+93', flag: '🇦🇫' },
        { name: 'Albania', code: 'AL', dial_code: '+355', flag: '🇦🇱' },
        { name: 'Algeria', code: 'DZ', dial_code: '+213', flag: '🇩🇿' },
        { name: 'Andorra', code: 'AD', dial_code: '+376', flag: '🇦🇩' },
        { name: 'Angola', code: 'AO', dial_code: '+244', flag: '🇦🇴' },
        { name: 'Antigua and Barbuda', code: 'AG', dial_code: '+1268', flag: '🇦🇬' },
        { name: 'Argentina', code: 'AR', dial_code: '+54', flag: '🇦🇷' },
        { name: 'Armenia', code: 'AM', dial_code: '+374', flag: '🇦🇲' },
        { name: 'Australia', code: 'AU', dial_code: '+61', flag: '🇦🇺' },
        { name: 'Austria', code: 'AT', dial_code: '+43', flag: '🇦🇹' },
        { name: 'Azerbaijan', code: 'AZ', dial_code: '+994', flag: '🇦🇿' },
        { name: 'Bahamas', code: 'BS', dial_code: '+1242', flag: '🇧🇸' },
        { name: 'Bahrain', code: 'BH', dial_code: '+973', flag: '🇧🇭' },
        { name: 'Bangladesh', code: 'BD', dial_code: '+880', flag: '🇧🇩' },
        { name: 'Barbados', code: 'BB', dial_code: '+1246', flag: '🇧🇧' },
        { name: 'Belarus', code: 'BY', dial_code: '+375', flag: '🇧🇾' },
        { name: 'Belgium', code: 'BE', dial_code: '+32', flag: '🇧🇪' },
        { name: 'Belize', code: 'BZ', dial_code: '+501', flag: '🇧🇿' },
        { name: 'Benin', code: 'BJ', dial_code: '+229', flag: '🇧🇯' },
        { name: 'Bhutan', code: 'BT', dial_code: '+975', flag: '🇧🇹' },
        { name: 'Bolivia', code: 'BO', dial_code: '+591', flag: '🇧🇴' },
        { name: 'Bosnia and Herzegovina', code: 'BA', dial_code: '+387', flag: '🇧🇦' },
        { name: 'Botswana', code: 'BW', dial_code: '+267', flag: '🇧🇼' },
        { name: 'Brazil', code: 'BR', dial_code: '+55', flag: '🇧🇷' },
        { name: 'Brunei', code: 'BN', dial_code: '+673', flag: '🇧🇳' },
        { name: 'Bulgaria', code: 'BG', dial_code: '+359', flag: '🇧🇬' },
        { name: 'Burkina Faso', code: 'BF', dial_code: '+226', flag: '🇧🇫' },
        { name: 'Burundi', code: 'BI', dial_code: '+257', flag: '🇧🇮' },
        { name: 'Cambodia', code: 'KH', dial_code: '+855', flag: '🇰🇭' },
        { name: 'Cameroon', code: 'CM', dial_code: '+237', flag: '🇨🇲' },
        { name: 'Canada', code: 'CA', dial_code: '+1', flag: '🇨🇦' },
        { name: 'Cape Verde', code: 'CV', dial_code: '+238', flag: '🇨🇻' },
        { name: 'Central African Republic', code: 'CF', dial_code: '+236', flag: '🇨🇫' },
        { name: 'Chad', code: 'TD', dial_code: '+235', flag: '🇹🇩' },
        { name: 'Chile', code: 'CL', dial_code: '+56', flag: '🇨🇱' },
        { name: 'China', code: 'CN', dial_code: '+86', flag: '🇨🇳' },
        { name: 'Colombia', code: 'CO', dial_code: '+57', flag: '🇨🇴' },
        { name: 'Comoros', code: 'KM', dial_code: '+269', flag: '🇰🇲' },
        { name: 'Congo', code: 'CG', dial_code: '+242', flag: '🇨🇬' },
        { name: 'Costa Rica', code: 'CR', dial_code: '+506', flag: '🇨🇷' },
        { name: 'Croatia', code: 'HR', dial_code: '+385', flag: '🇭🇷' },
        { name: 'Cuba', code: 'CU', dial_code: '+53', flag: '🇨🇺' },
        { name: 'Cyprus', code: 'CY', dial_code: '+357', flag: '🇨🇾' },
        { name: 'Czech Republic', code: 'CZ', dial_code: '+420', flag: '🇨🇿' },
        { name: 'Denmark', code: 'DK', dial_code: '+45', flag: '🇩🇰' },
        { name: 'Djibouti', code: 'DJ', dial_code: '+253', flag: '🇩🇯' },
        { name: 'Dominica', code: 'DM', dial_code: '+1767', flag: '🇩🇲' },
        { name: 'Dominican Republic', code: 'DO', dial_code: '+1849', flag: '🇩🇴' },
        { name: 'Ecuador', code: 'EC', dial_code: '+593', flag: '🇪🇨' },
        { name: 'Egypt', code: 'EG', dial_code: '+20', flag: '🇪🇬' },
        { name: 'El Salvador', code: 'SV', dial_code: '+503', flag: '🇸🇻' },
        { name: 'Equatorial Guinea', code: 'GQ', dial_code: '+240', flag: '🇬🇶' },
        { name: 'Eritrea', code: 'ER', dial_code: '+291', flag: '🇪🇷' },
        { name: 'Estonia', code: 'EE', dial_code: '+372', flag: '🇪🇪' },
        { name: 'Ethiopia', code: 'ET', dial_code: '+251', flag: '🇪🇹' },
        { name: 'Fiji', code: 'FJ', dial_code: '+679', flag: '🇫🇯' },
        { name: 'Finland', code: 'FI', dial_code: '+358', flag: '🇫🇮' },
        { name: 'France', code: 'FR', dial_code: '+33', flag: '🇫🇷' },
        { name: 'Gabon', code: 'GA', dial_code: '+241', flag: '🇬🇦' },
        { name: 'Gambia', code: 'GM', dial_code: '+220', flag: '🇬🇲' },
        { name: 'Georgia', code: 'GE', dial_code: '+995', flag: '🇬🇪' },
        { name: 'Germany', code: 'DE', dial_code: '+49', flag: '🇩🇪' },
        { name: 'Ghana', code: 'GH', dial_code: '+233', flag: '🇬🇭' },
        { name: 'Greece', code: 'GR', dial_code: '+30', flag: '🇬🇷' },
        { name: 'Grenada', code: 'GD', dial_code: '+1473', flag: '🇬🇩' },
        { name: 'Guatemala', code: 'GT', dial_code: '+502', flag: '🇬🇹' },
        { name: 'Guinea', code: 'GN', dial_code: '+224', flag: '🇬🇳' },
        { name: 'Guinea-Bissau', code: 'GW', dial_code: '+245', flag: '🇬🇼' },
        { name: 'Guyana', code: 'GY', dial_code: '+592', flag: '🇬🇾' },
        { name: 'Haiti', code: 'HT', dial_code: '+509', flag: '🇭🇹' },
        { name: 'Honduras', code: 'HN', dial_code: '+504', flag: '🇭🇳' },
        { name: 'Hungary', code: 'HU', dial_code: '+36', flag: '🇭🇺' },
        { name: 'Iceland', code: 'IS', dial_code: '+354', flag: '🇮🇸' },
        { name: 'India', code: 'IN', dial_code: '+91', flag: '🇮🇳' },
        { name: 'Indonesia', code: 'ID', dial_code: '+62', flag: '🇮🇩' },
        { name: 'Iran', code: 'IR', dial_code: '+98', flag: '🇮🇷' },
        { name: 'Iraq', code: 'IQ', dial_code: '+964', flag: '🇮🇶' },
        { name: 'Ireland', code: 'IE', dial_code: '+353', flag: '🇮🇪' },
        { name: 'Israel', code: 'IL', dial_code: '+972', flag: '🇮🇱' },
        { name: 'Italy', code: 'IT', dial_code: '+39', flag: '🇮🇹' },
        { name: 'Jamaica', code: 'JM', dial_code: '+1876', flag: '🇯🇲' },
        { name: 'Japan', code: 'JP', dial_code: '+81', flag: '🇯🇵' },
        { name: 'Jordan', code: 'JO', dial_code: '+962', flag: '🇯🇴' },
        { name: 'Kazakhstan', code: 'KZ', dial_code: '+7', flag: '🇰🇿' },
        { name: 'Kenya', code: 'KE', dial_code: '+254', flag: '🇰🇪' },
        { name: 'Kiribati', code: 'KI', dial_code: '+686', flag: '🇰🇮' },
        { name: 'Kuwait', code: 'KW', dial_code: '+965', flag: '🇰🇼' },
        { name: 'Kyrgyzstan', code: 'KG', dial_code: '+996', flag: '🇰🇬' },
        { name: 'Laos', code: 'LA', dial_code: '+856', flag: '🇱🇦' },
        { name: 'Latvia', code: 'LV', dial_code: '+371', flag: '🇱🇻' },
        { name: 'Lebanon', code: 'LB', dial_code: '+961', flag: '🇱🇧' },
        { name: 'Lesotho', code: 'LS', dial_code: '+266', flag: '🇱🇸' },
        { name: 'Liberia', code: 'LR', dial_code: '+231', flag: '🇱🇷' },
        { name: 'Libya', code: 'LY', dial_code: '+218', flag: '🇱🇾' },
        { name: 'Liechtenstein', code: 'LI', dial_code: '+423', flag: '🇱🇮' },
        { name: 'Lithuania', code: 'LT', dial_code: '+370', flag: '🇱🇹' },
        { name: 'Luxembourg', code: 'LU', dial_code: '+352', flag: '🇱🇺' },
        { name: 'Madagascar', code: 'MG', dial_code: '+261', flag: '🇲🇬' },
        { name: 'Malawi', code: 'MW', dial_code: '+265', flag: '🇲🇼' },
        { name: 'Malaysia', code: 'MY', dial_code: '+60', flag: '🇲🇾' },
        { name: 'Maldives', code: 'MV', dial_code: '+960', flag: '🇲🇻' },
        { name: 'Mali', code: 'ML', dial_code: '+223', flag: '🇲🇱' },
        { name: 'Malta', code: 'MT', dial_code: '+356', flag: '🇲🇹' },
        { name: 'Marshall Islands', code: 'MH', dial_code: '+692', flag: '🇲🇭' },
        { name: 'Mauritania', code: 'MR', dial_code: '+222', flag: '🇲🇷' },
        { name: 'Mauritius', code: 'MU', dial_code: '+230', flag: '🇲🇺' },
        { name: 'Mexico', code: 'MX', dial_code: '+52', flag: '🇲🇽' },
        { name: 'Micronesia', code: 'FM', dial_code: '+691', flag: '🇫🇲' },
        { name: 'Moldova', code: 'MD', dial_code: '+373', flag: '🇲🇩' },
        { name: 'Monaco', code: 'MC', dial_code: '+377', flag: '🇲🇨' },
        { name: 'Mongolia', code: 'MN', dial_code: '+976', flag: '🇲🇳' },
        { name: 'Montenegro', code: 'ME', dial_code: '+382', flag: '🇲🇪' },
        { name: 'Morocco', code: 'MA', dial_code: '+212', flag: '🇲🇦' },
        { name: 'Mozambique', code: 'MZ', dial_code: '+258', flag: '🇲🇿' },
        { name: 'Myanmar', code: 'MM', dial_code: '+95', flag: '🇲🇲' },
        { name: 'Namibia', code: 'NA', dial_code: '+264', flag: '🇳🇦' },
        { name: 'Nauru', code: 'NR', dial_code: '+674', flag: '🇳🇷' },
        { name: 'Nepal', code: 'NP', dial_code: '+977', flag: '🇳🇵' },
        { name: 'Netherlands', code: 'NL', dial_code: '+31', flag: '🇳🇱' },
        { name: 'New Zealand', code: 'NZ', dial_code: '+64', flag: '🇳🇿' },
        { name: 'Nicaragua', code: 'NI', dial_code: '+505', flag: '🇳🇮' },
        { name: 'Niger', code: 'NE', dial_code: '+227', flag: '🇳🇪' },
        { name: 'Nigeria', code: 'NG', dial_code: '+234', flag: '🇳🇬' },
        { name: 'North Korea', code: 'KP', dial_code: '+850', flag: '🇰🇵' },
        { name: 'North Macedonia', code: 'MK', dial_code: '+389', flag: '🇲🇰' },
        { name: 'Norway', code: 'NO', dial_code: '+47', flag: '🇳🇴' },
        { name: 'Oman', code: 'OM', dial_code: '+968', flag: '🇴🇲' },
        { name: 'Pakistan', code: 'PK', dial_code: '+92', flag: '🇵🇰' },
        { name: 'Palau', code: 'PW', dial_code: '+680', flag: '🇵🇼' },
        { name: 'Palestine', code: 'PS', dial_code: '+970', flag: '🇵🇸' },
        { name: 'Panama', code: 'PA', dial_code: '+507', flag: '🇵🇦' },
        { name: 'Papua New Guinea', code: 'PG', dial_code: '+675', flag: '🇵🇬' },
        { name: 'Paraguay', code: 'PY', dial_code: '+595', flag: '🇵🇾' },
        { name: 'Peru', code: 'PE', dial_code: '+51', flag: '🇵🇪' },
        { name: 'Philippines', code: 'PH', dial_code: '+63', flag: '🇵🇭' },
        { name: 'Poland', code: 'PL', dial_code: '+48', flag: '🇵🇱' },
        { name: 'Portugal', code: 'PT', dial_code: '+351', flag: '🇵🇹' },
        { name: 'Qatar', code: 'QA', dial_code: '+974', flag: '🇶🇦' },
        { name: 'Romania', code: 'RO', dial_code: '+40', flag: '🇷🇴' },
        { name: 'Russia', code: 'RU', dial_code: '+7', flag: '🇷🇺' },
        { name: 'Rwanda', code: 'RW', dial_code: '+250', flag: '🇷🇼' },
        { name: 'Saint Kitts and Nevis', code: 'KN', dial_code: '+1869', flag: '🇰🇳' },
        { name: 'Saint Lucia', code: 'LC', dial_code: '+1758', flag: '🇱🇨' },
        { name: 'Saint Vincent and the Grenadines', code: 'VC', dial_code: '+1784', flag: '🇻🇨' },
        { name: 'Samoa', code: 'WS', dial_code: '+685', flag: '🇼🇸' },
        { name: 'San Marino', code: 'SM', dial_code: '+378', flag: '🇸🇲' },
        { name: 'Sao Tome and Principe', code: 'ST', dial_code: '+239', flag: '🇸🇹' },
        { name: 'Saudi Arabia', code: 'SA', dial_code: '+966', flag: '🇸🇦' },
        { name: 'Senegal', code: 'SN', dial_code: '+221', flag: '🇸🇳' },
        { name: 'Serbia', code: 'RS', dial_code: '+381', flag: '🇷🇸' },
        { name: 'Seychelles', code: 'SC', dial_code: '+248', flag: '🇸🇨' },
        { name: 'Sierra Leone', code: 'SL', dial_code: '+232', flag: '🇸🇱' },
        { name: 'Singapore', code: 'SG', dial_code: '+65', flag: '🇸🇬' },
        { name: 'Slovakia', code: 'SK', dial_code: '+421', flag: '🇸🇰' },
        { name: 'Slovenia', code: 'SI', dial_code: '+386', flag: '🇸🇮' },
        { name: 'Solomon Islands', code: 'SB', dial_code: '+677', flag: '🇸🇧' },
        { name: 'Somalia', code: 'SO', dial_code: '+252', flag: '🇸🇴' },
        { name: 'South Africa', code: 'ZA', dial_code: '+27', flag: '🇿🇦' },
        { name: 'South Korea', code: 'KR', dial_code: '+82', flag: '🇰🇷' },
        { name: 'South Sudan', code: 'SS', dial_code: '+211', flag: '🇸🇸' },
        { name: 'Spain', code: 'ES', dial_code: '+34', flag: '🇪🇸' },
        { name: 'Sri Lanka', code: 'LK', dial_code: '+94', flag: '🇱🇰' },
        { name: 'Sudan', code: 'SD', dial_code: '+249', flag: '🇸🇩' },
        { name: 'Suriname', code: 'SR', dial_code: '+597', flag: '🇸🇷' },
        { name: 'Sweden', code: 'SE', dial_code: '+46', flag: '🇸🇪' },
        { name: 'Switzerland', code: 'CH', dial_code: '+41', flag: '🇨🇭' },
        { name: 'Syria', code: 'SY', dial_code: '+963', flag: '🇸🇾' },
        { name: 'Taiwan', code: 'TW', dial_code: '+886', flag: '🇹🇼' },
        { name: 'Tajikistan', code: 'TJ', dial_code: '+992', flag: '🇹🇯' },
        { name: 'Tanzania', code: 'TZ', dial_code: '+255', flag: '🇹🇿' },
        { name: 'Thailand', code: 'TH', dial_code: '+66', flag: '🇹🇭' },
        { name: 'Timor-Leste', code: 'TL', dial_code: '+670', flag: '🇹🇱' },
        { name: 'Togo', code: 'TG', dial_code: '+228', flag: '🇹🇬' },
        { name: 'Tonga', code: 'TO', dial_code: '+676', flag: '🇹🇴' },
        { name: 'Trinidad and Tobago', code: 'TT', dial_code: '+1868', flag: '🇹🇹' },
        { name: 'Tunisia', code: 'TN', dial_code: '+216', flag: '🇹🇳' },
        { name: 'Turkey', code: 'TR', dial_code: '+90', flag: '🇹🇷' },
        { name: 'Turkmenistan', code: 'TM', dial_code: '+993', flag: '🇹🇲' },
        { name: 'Tuvalu', code: 'TV', dial_code: '+688', flag: '🇹🇻' },
        { name: 'Uganda', code: 'UG', dial_code: '+256', flag: '🇺🇬' },
        { name: 'Ukraine', code: 'UA', dial_code: '+380', flag: '🇺🇦' },
        { name: 'United Arab Emirates', code: 'AE', dial_code: '+971', flag: '🇦🇪' },
        { name: 'United Kingdom', code: 'GB', dial_code: '+44', flag: '🇬🇧' },
        { name: 'United States', code: 'US', dial_code: '+1', flag: '🇺🇸' },
        { name: 'Uruguay', code: 'UY', dial_code: '+598', flag: '🇺🇾' },
        { name: 'Uzbekistan', code: 'UZ', dial_code: '+998', flag: '🇺🇿' },
        { name: 'Vanuatu', code: 'VU', dial_code: '+678', flag: '🇻🇺' },
        { name: 'Vatican City', code: 'VA', dial_code: '+39', flag: '🇻🇦' },
        { name: 'Venezuela', code: 'VE', dial_code: '+58', flag: '🇻🇪' },
        { name: 'Vietnam', code: 'VN', dial_code: '+84', flag: '🇻🇳' },
        { name: 'Yemen', code: 'YE', dial_code: '+967', flag: '🇾🇪' },
        { name: 'Zambia', code: 'ZM', dial_code: '+260', flag: '🇿🇲' },
        { name: 'Zimbabwe', code: 'ZW', dial_code: '+263', flag: '🇿🇼' }
      ]
    this.render();
    
    // select app container: component containing the form
    this.app = this.getRootNode().host;
  }

  render() {
    this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const form = this.querySelector('#name-form');
    this.inputListeners(form);
    this.setupCountryCodeSelector(form);
    this.submitForm(form);
    this.handleBack(form);
    this.prefillForm(form, this.app.getRegistrationData());
  }

  handleBack = form => {
    const backButton = form.querySelector('.buttons > .button.prev');
    backButton.addEventListener('click', () => {
      this.app.navigate({ kind: 'landing' });
    });
  }

  prefillForm = (form, data) => {
    const name = form.querySelector('input[name="name"]');
    const social = form.querySelector('input[name="social"]');
    const phone = form.querySelector('input[name="phone"]');
    const email = form.querySelector('input[name="email"]');

    // check for keys if available prefill else ignore
    if (data.name) name.value = data.name;
    if (data.social) social.value = data.social;
    if (data.phone) phone.value = data.phone;
    if (data.email) email.value = data.email;
  }

  submitForm = form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const submitButton = form.querySelector('.button.next');

      // add loading state & disable button
      submitButton.innerHTML = this.getLoader()
      submitButton.disabled = true;
      
      // validate form
      const result = this.validateForm(form);

      if (result.validated && result.values) {

        const check = await this.checkPhoneOrEmail(form);

        if (check) {
          // set values to app
          this.app.setRegistrationData(result.values);
          // navigate to next form
          this.app.navigate({ kind: 'registration', no: 2 });
        } else {
          // remove loading state & enable button
          submitButton.innerHTML = this.getButtonNext();
          submitButton.disabled = false;
        }
      } else {
        // remove loading state & enable button
        submitButton.innerHTML = this.getButtonNext();
        submitButton.disabled = false;
      }
    });
  }

  checkPhoneOrEmail = async form => {
    let phone = form.querySelector('input[name="phone"]').value.trim();
    let code = form.querySelector('.selected-code .dial-code').textContent;
    phone = code + phone;
    const email = form.querySelector('input[name="email"]').value.trim();

    // get parent elements
    const phoneParent = form.querySelector('.input-group.phone');
    const emailParent = form.querySelector('.input-group.email');

    // get status elements
    const phoneStatus = phoneParent.querySelector('.status');
    const emailStatus = emailParent.querySelector('.status');

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, email })
    }

    try {
      const response = await this.fetchWithTimeout(this.check, options);
      const data = await response.json();

      if(data.success) {
        if(data.exists) { 
          if (data.phone) {
            phoneStatus.textContent = 'Similar phone number exists';
            phoneParent.classList.remove('success');
            phoneParent.classList.add('failed');
          } else {
            emailStatus.textContent = 'Similar email address exists';
            emailParent.classList.remove('success');
            emailParent.classList.add('failed');
          }

          return false;
        } else {
          phoneParent.classList.remove('failed');
          phoneParent.classList.add('success');
          emailParent.classList.remove('failed');
          emailParent.classList.add('success');
          return true;
        }
      } else {
        console.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  fetchWithTimeout = async (url, options = {}, timeout = 9500) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw new Error(`Network error: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getHeader()}
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      <form class="fields initial" id="name-form">
        <div class="field bio">
          <div class="input-group name">
            <label for="name" class="center">Legal Name</label>
            <span class="guide">Legal name <strong>MUST</strong> be the same as the name on your National ID or Passport.</span>
            <input data-name="name" type="text" name="name" id="name" placeholder="Your name e.g John Doe" required>
            <span class="status">Name is required</span>
          </div>
          <div class="input-group social">
            <label for="social" class="center">Desired Name</label>
            <span class="guide">Desired name is the name to be adopted by Thealcohesion Community, <strong>MUST</strong> be a native name.</span>
            <input data-name="social" type="text" name="social" id="social" placeholder="Your preferred desired name e.g John Doe" required>
            <span class="status">Desired name is required</span>
          </div>
          <div class="input-group phone">
            <label for="phone" class="center">Your Phone</label>
            <div class="wrapper">
              <div class="country-code-selector">
                <div class="selected-code">
                  <span class="flag">🇦🇫</span>
                  <span class="dial-code">+93</span>
                </div>
                <div class="dropdown">
                  <input type="text" class="country-search" placeholder="Search country...">
                  <ul class="country-list"></ul>
                </div>
              </div>
              <input data-name="phone" type="tel" name="phone" id="phone" placeholder="Your number e.g 712345678" required>
            </div>
            <span class="status">Phone is required</span>
          </div>
          <div class="input-group email">
            <label for="email" class="center">Your Email</label>
            <input data-name="email" type="email" name="email" id="email" placeholder="Your email e.g doe@example.com" required>
            <span class="status">Email is required</span>
          </div>
        </div>
        ${this.getButtons()}
      </form>
    `;
  }

  getHeader = () => {
    return /* html */`
      <div class="top">
        <p class="desc">
          Ensure you provide a valid email address, a reachable phone number and a valid name.
        </p>
      </div>
    `;
  }

  getButtons = () => {
    return /*html*/`
      <div class="buttons">
        <button type="button" class="button prev">
          ${this.getButtonPrev()}
        </button>
        <button type="submit" class="button next">
          ${this.getButtonNext()}
        </button>
      </div>
    `
  }

  getButtonPrev = () => {
    return /*html*/`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
        <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="text">Back</span>
    `;
  }

  getButtonNext = () => {
    return /*html*/`
      <span class="text">Next</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  setupCountryCodeSelector(form) {
    const selector = form.querySelector('.wrapper > .country-code-selector');
    const selectedCode = selector.querySelector('.selected-code');
    const dropdown = selector.querySelector('.dropdown');
    const searchInput = dropdown.querySelector('.country-search');
    const countryList = dropdown.querySelector('.country-list');

    // Populate country list
    this.populateCountryList(countryList);

    // Toggle dropdown
    selectedCode.addEventListener('click', () => {
     // get computed style display value
      const display = window.getComputedStyle(dropdown).display;
      if (display === 'none') {
        dropdown.style.display = 'block';
        dropdown.classList.add('show');
      } else {
        dropdown.style.display = 'none';
        dropdown.classList.remove('show');
      }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      this.filterCountries(countryList, searchTerm);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        dropdown.classList.remove('show');
        // dropdown.style.display = 'none';
      }
    });

    // Select country
    countryList.addEventListener('click', (e) => {
      const listItem = e.target.closest('li');
      if (listItem) {
        const dialCode = listItem.getAttribute('data-dial-code');
        const flag = listItem.getAttribute('data-flag');
        this.updateSelectedCountry(selectedCode, flag, dialCode);
        dropdown.classList.remove('show');
        dropdown.style.display = 'none';
      }
    });
  }

  closeDropdown(selector) {
    const dropdown = selector.querySelector('.dropdown');
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        dropdown.classList.remove('show');
        dropdown.style.display = 'none';
      }
    },{ once: true });
  }

  populateCountryList(countryList) {
    this.countryCodes.forEach(country => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="flag">${country.flag}</span>
        <span class="country-name">${country.name}</span>
        <span class="dial-code">${country.dial_code}</span>
      `;
      li.setAttribute('data-dial-code', country.dial_code);
      li.setAttribute('data-flag', country.flag);
      countryList.appendChild(li);
    });
  }

  filterCountries(countryList, searchTerm) {
    const items = countryList.getElementsByTagName('li');
    for (let item of items) {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    }
  }

  updateSelectedCountry(selectedCode, flag, dialCode) {
    selectedCode.innerHTML = `
      <span class="flag">${flag}</span>
      <span class="dial-code">${dialCode}</span>
    `;
  }

  inputListeners = form => {
    const name = form.querySelector('input[data-name="name"]');
    const phone = form.querySelector('input[data-name="phone"]');
    const email = form.querySelector('input[data-name="email"]');
    const social = form.querySelector('input[data-name="social"]');

    name.addEventListener('input', e => {
      let value = e.target.value;

      const status = name.parentElement.querySelector('.status');

      // capitalize first letter of each word without trailing extra space
      value = value.replace(/\b\w/g, l => l.toUpperCase());
      e.target.value = value;

      value = name.value.trim();

      // check if value is empty or less than 5 characters
      if (!value || value.length < 5) {
        status.textContent = 'Name must be at least 5 characters long';
        name.parentElement.classList.remove('success');
        name.parentElement.classList.add('failed');
      } 
      // check a user must have two or three names
      else if (value.split(' ').length < 2) {
        status.textContent = 'Add at least two names';
        name.parentElement.classList.remove('success');
        name.parentElement.classList.add('failed');
      }
      // check maximum names allowed: 3
      else if (value.split(' ').length > 3) {
        status.textContent = 'You can only add a maximum of 3 names';
        name.parentElement.classList.remove('success');
        name.parentElement.classList.add('failed');
      }
      else {
        name.parentElement.classList.remove('failed');
        name.parentElement.classList.add('success');
      }
    });

    social.addEventListener('input', e => {
      let value = e.target.value;

      const status = social.parentElement.querySelector('.status');

      // capitalize first letter of each word without trailing extra space
      value = value.replace(/\b\w/g, l => l.toUpperCase());
      e.target.value = value;

      value = social.value.trim();

      // check if value is empty or less than 5 characters
      if (!value || value.length < 5) {
        status.textContent = 'Name must be at least 5 characters long';
        social.parentElement.classList.remove('success');
        social.parentElement.classList.add('failed');
      } 
      // check a user must have two or three names
      else if (value.split(' ').length < 2) {
        status.textContent = 'Add at least two names';
        social.parentElement.classList.remove('success');
        social.parentElement.classList.add('failed');
      }
      // check maximum names allowed: 3
      else if (value.split(' ').length > 3) {
        status.textContent = 'You can only add a maximum of 3 names';
        social.parentElement.classList.remove('success');
        social.parentElement.classList.add('failed');
      }
      else {
        social.parentElement.classList.remove('failed');
        social.parentElement.classList.add('success');
      }
    })

    phone.addEventListener('input', e => {
      const parent = phone.parentElement.parentElement;
      const status = parent.querySelector('.status');
      let value = e.target.value.trim();
      const selectedDialCode = parent.querySelector('.selected-code .dial-code').textContent;

      // Remove the first 0 if it exists
      value = value.replace(/^0/, '');
      e.target.value = value;

      // only accept numbers
      if (!/^\d+$/.test(value)) {
        status.textContent = 'Phone number must only contain numbers';
        parent.classList.remove('success');
        parent.classList.add('failed');
      }
      // check if value is empty or too short/long
      else if (!value || value.length < 7 || value.length > 15) {
        status.textContent = 'Phone number must be between 4 and 15 digits';
        parent.classList.remove('success');
        parent.classList.add('failed');
      }
      else {
        parent.classList.remove('failed');
        parent.classList.add('success');
      }
    })

    // when phone input is focused add border to span.code
    phone.addEventListener('focus', e => {
      const parent = phone.parentElement.parentElement;

      // add parent class focused
      parent.classList.add('focused');
    })

    // When phone input is blurred remove border from span.code
    phone.addEventListener('blur', e => {
      const parent = phone.parentElement.parentElement;

      // remove parent class focused
      parent.classList.remove('focused');
    })


    email.addEventListener('input', e => {
      const parent = email.parentElement;
      const status = parent.querySelector('.status');
      const value = e.target.value.trim();

      // check if value is empty or less than 5 characters
      if (!value) {
        status.textContent = 'Email is required';
        parent.classList.remove('success');
        parent.classList.add('failed');
      }
      // validate email using regex
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        status.textContent = 'Invalid email address';
        parent.classList.remove('success');
        parent.classList.add('failed');
      }
      else {
        parent.classList.remove('failed');
        parent.classList.add('success');
      }
    })
  }

  validateForm = form => {
    const name = form.querySelector('input[data-name="name"]');
    const social = form.querySelector('input[data-name="social"]');
    const phone = form.querySelector('input[data-name="phone"]');
    const email = form.querySelector('input[data-name="email"]');

    const nameParent = name.parentElement;
    const socialParent = social.parentElement;
    const phoneParent = phone.parentElement.parentElement;
    const emailParent = email.parentElement;

    const nameStatus = nameParent.querySelector('.status');
    const socialStatus = socialParent.querySelector('.status');
    const phoneStatus = phoneParent.querySelector('.status');
    const emailStatus = emailParent.querySelector('.status');

    const nameValue = name.value.trim();
    const socialValue = social.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const phoneCode = phoneParent.querySelector('.selected-code .dial-code').textContent;

    // Validate name
    if (!nameValue || nameValue.length < 5) {
      nameStatus.textContent = 'Name must be at least 5 characters long';
      nameParent.classList.remove('success');
      nameParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    } 
    else if (nameValue.split(' ').length < 2) {
      nameStatus.textContent = 'Add at least two names';
      nameParent.classList.remove('success');
      nameParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    }
    else if (nameValue.split(' ').length > 3) {
      nameStatus.textContent = 'You can only add a maximum of 3 names';
      nameParent.classList.remove('success');
      nameParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    }
    else {
      nameParent.classList.remove('failed');
      nameParent.classList.add('success');
    }

    // Validate social name
    if (!socialValue || socialValue.length < 5) {
      socialStatus.textContent = 'Name must be at least 5 characters long';
      socialParent.classList.remove('success');
      socialParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    } 
    else if (socialValue.split(' ').length < 2) {
      socialStatus.textContent = 'Add at least two names';
      socialParent.classList.remove('success');
      socialParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    }
    else if (socialValue.split(' ').length > 3) {
      socialStatus.textContent = 'You can only add a maximum of 3 names';
      socialParent.classList.remove('success');
      socialParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    }
    else {
      socialParent.classList.remove('failed');
      socialParent.classList.add('success');
    }

    // Validate phone
    if (!phoneValue || phoneValue.length < 7 || phoneValue.length > 15) {
      phoneStatus.textContent = 'Phone number must be between 7 and 15 digits';
      phoneParent.classList.remove('success');
      phoneParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    }
    else if (!/^\d+$/.test(phoneValue)) {
      phoneStatus.textContent = 'Phone number must only contain numbers';
      phoneParent.classList.remove('success');
      phoneParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    }
    else {
      phoneParent.classList.remove('failed');
      phoneParent.classList.add('success');
    }

    // Validate email
    if (!emailValue) {
      emailStatus.textContent = 'Email is required';
      emailParent.classList.remove('success');
      emailParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      emailStatus.textContent = 'Invalid email address';
      emailParent.classList.remove('success');
      emailParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    }
    else {
      emailParent.classList.remove('failed');
      emailParent.classList.add('success');
    }

    // return true if all fields are valid
    return {
      validated: true,
      values: {
        name: nameValue,
        social: socialValue,
        phone: phoneCode + phoneValue,
        email: emailValue
      }
    }

  }

  getLoader = () => {
    return /*html*/`
      <div id="loader" class="loader"></div>
    `;
  }

  getStyles() {
    return /* css */`
      <style>
        *,
        *:after,
        *:before {
          box-sizing: border-box !important;
          font-family: inherit;
          -webkit-box-sizing: border-box !important;
        }

        *:focus {
          outline: inherit !important;
        }

        *::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          padding: 0;
          margin: 0;
          font-family: inherit;
        }

        p,
        ul,
        ol {
          padding: 0;
          margin: 0;
        }

        a {
          text-decoration: none;
        }

        #loader.loader {
          width: 42px;
          aspect-ratio: 4;
          --c:#6e2d6e 90%,#0000;
          --c1:#d1a0d1 90%,#0000;
          --c2:#8a3d8a 90%,#0000;
          background: 
            radial-gradient(circle closest-side at left  8px top 50%,var(--c)),
            radial-gradient(circle closest-side                     ,var(--c1)),
            radial-gradient(circle closest-side at right 8px top 50%,var(--c2));
          background-size: 100% 100%;
          background-repeat: no-repeat;
          animation: l4 1s infinite alternate;
        }
        
        @keyframes l4 {
          to { width: 16px; aspect-ratio: 1 }
        }

        .top {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          margin: 10px 0 15px 0;
          width: 100%;
        }

        .top > h4.title {
          border-bottom: var(--border-mobile);
          display: flex;
          align-items: center;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0 6px 0;
        }

        .top > .desc {
          padding: 0;
          margin: 0;
          color: var(--text-color);
          text-align: center;
          font-size: 0.95rem;
          font-family: var(--font-main), sans-serif;
        }

        form.fields {
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        form.fields > .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 20px;
        }

        form.fields.center > .field {
          align-items: center;
        }

        form.fields .field .input-group {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          color: var(--text-color);
          gap: 5px;
          position: relative;
          transition: border-color 0.3s ease-in-out;
        }

        form.fields .field .input-group > .wrapper {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        form.fields .field .input-group.social > span.guide,
        form.fields .field .input-group.name > span.guide {
          color: var(--text-color);
          font-size: 0.8rem;
          font-family: var(--font-read), sans-serif;
          padding: 0 5px;
          display: inline-block;
        }

        form.fields .field .input-group > span.guide > strong {
          font-weight: 600;
          display: inline-block;
        }

        form.fields .field .input-group > svg {
          position: absolute;
          right: 10px;
          top: 38px;
          width: 20px;
          height: 20px;
        }

        form.fields .field .input-group > svg {
          display: none;
        }

        form.fields .field .input-group.success > svg {
          display: inline-block;
        }

        form.fields .field .input-group.failed > svg {
          display: inline-block;
        }

        form.fields .field .input-group.success > svg {
          color: var(--accent-color);
        }

        form.fields .field .input-group.failed > svg {
          color: var(--error-color);
        }

        form.fields label {
          padding: 0 0 5px 0;
          color: var(--text-color);
        }

        form.fields .field.bio label {
          padding: 0 0 0 5px;
        }

        form.fields label {
          color: var(--label-color);
          font-size: 1.1rem;
          font-family: var(--font-main), sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        form.fields .field input {
          border: var(--input-border);
          background-color: var(--background) !important;
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
        }

        form.fields .field .input-group > .wrapper > input {
          border-left: none;
          font-size: 1rem;
          width: 100%;
          height: 40px;
          min-height: 40px;
          width: calc(100% - 50px);
          min-width: calc(100% - 50px);
          outline: none;
          padding: 10px 12px 10px 5px;
          border-radius: 0 12px 12px 0;
          color: var(--text-color);
        }

        form.fields .field .input-group > .wrapper > span.code {
          background-color: var(--background);
          color: var(--text-color);
          font-size: 1rem;
          padding: 10px 0 10px 10px;
          max-height: 40px;
          font-weight: 500;
          width: 50px;
          border-radius: 12px 0 0 12px;
          border: var(--input-border);
          border-right: none;
        }

        form.fields .field .input-group.focused > .wrapper > span.code {
          border: var(--input-border-focus);
          border-right: none;
        }
        
        form.fields .field input:-webkit-autofill,
        form.fields .field input:-webkit-autofill:hover, 
        form.fields .field input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--text-color) !important;
        }
        
        form.fields .field input:autofill {
          filter: none;
          color: var(--text-color) !important;
        }

        form.fields .field input:focus {
          border: var(--input-border-focus);
        }

        form.fields .field .input-group.success input,
        form.fields .field .input-group.success input:focus {
          border: var(--input-border-focus);
        }

        form.fields .field .input-group.focused.success > .wrapper > span.code,
        form.fields .field .input-group.success > .wrapper > span.code {
          border: var(--input-border-focus);
          border-right: none;
        }

        form.fields .field .input-group.success > .wrapper input,
        form.fields .field .input-group.success > .wrapper input:focus {
          border: var(--input-border-focus);
          border-left: none;
        }

        form.fields .field .input-group.failed input,
        form.fields .field .input-group.failed input:focus {
          border: var(--input-border-error);
        }

        form.fields .field .input-group.failed > .wrapper input,
        form.fields .field .input-group.failed > .wrapper input:focus {
          border: var(--input-border-error);
          border-left: none;
        }

        form.fields .field .input-group.focused.failed > .wrapper > span.code,
        form.fields .field .input-group.failed > .wrapper > span.code {
          border: var(--input-border-error);
          border-right: none;
        }

        form.fields .field .input-group.success input {
          color: var(--accent-color);
        }

        form.fields .field .input-group.failed input {
          color: var(--error-color);
        }

        form.fields label.focused {
          top: -10px;
          font-size: 0.9rem;
          background-color: var(--label-focus-background);
          padding: 0 5px;
        }

        form.fields .field span.status {
          color: var(--error-color);
          font-size: 0.95rem;
          display: none;
          padding: 0 0 0 5px;
        }

        form.fields .field .input-group.failed span.status {
          color: var(--error-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          color: var(--accent-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          display: none;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector {
          position: relative;
          width: 100px;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector > .selected-code {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 10px 0 10px 10px;
          height: 40px;
          max-height: 40px;
          width: 80px;
          border: var(--input-border);
          border-right: none;
          border-radius: 12px 0 0 12px;
        }

        form.fields .field .input-group.focused > .wrapper > .country-code-selector > .selected-code {
          border: var(--input-border-focus);
          border-right: none;
        }

        form.fields .field .input-group.failed > .wrapper > .country-code-selector > .selected-code {
          border: var(--input-border-error);
          border-right: none;
        }

        form.fields .field .input-group.success > .wrapper > .country-code-selector > .selected-code {
          border: var(--input-border-focus);
          border-right: none;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector > .dropdown {
          display: none;
          position: absolute;
          top: 95%;
          left: 0;
          width: 250px;
          max-height: 300px;
          overflow-y: auto;
          background-color: var(--background);
          border: var(--border);
          box-shadow: var(--box-shadow);
          border-radius: 12px;
          z-index: 1000;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector > .dropdown.show {
          display: block;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector > .dropdown > input.country-search {
          width: 100%;
          padding: 5px 10px;
          border: none;
          border-radius: 0;
          color: var(--text-color);
          border-bottom: var(--border);
        }

        form.fields .field .input-group.failed > .wrapper > .country-code-selector > .dropdown > input.country-search {
          color: var(--text-color);
        }

        form.fields .field .input-group > .wrapper > .country-code-selector .country-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector .country-list li {
          display: flex;
          align-items: center;
          padding: 10px;
          cursor: pointer;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector .country-list li:hover {
          background-color: var(--background-hover);
        }

        form.fields .field .input-group > .wrapper > .country-code-selector .flag {
          margin-right: 10px;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector .country-name {
          flex-grow: 1;
        }

        form.fields .field .input-group > .wrapper > .country-code-selector .dial-code {
          color: var(--text-color-light);
        }

        form.fields .field .input-group > .wrapper > input[data-name="phone"] {
          width: calc(100% - 80px);
          min-width: calc(100% - 80px);
          border-left: none;
          border-radius: 0 12px 12px 0;
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin: 10px 0;
        }

        .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        .buttons > .button {
          border: none;
          position: relative;
          background: var(--gray-background);
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px 7px;
          height: 35px;
          min-width: 90px;
          width: 90px;
          position: relative;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .buttons > .button.prev {
          border: var(--action-border);
          background: none;
          background-color: none;
          color: var(--text-color);
          padding: 6px 15px 6px 13px;
        }

        .buttons > .button.next {
          color: var(--text-color);
          padding: 7px 13px 7px 15px;
        }

        .buttons > .button.next:hover {
          color: var(--text-color);
        }

        .buttons > .button svg {
          width: 18px;
          height: 18px;
          color: inherit;
          margin: 0 0 -2px 0;
        }

        .buttons > .button.next {
          color: var(--text-color);
          background: var(--gray-background);
        }

        .buttons > .button.prev.disabled,
        .buttons > .button.next.disabled {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          form.fields .buttons > .button {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}