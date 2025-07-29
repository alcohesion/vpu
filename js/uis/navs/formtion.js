export default class FormationNav extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
    this.active_tab = null;
    this.active_sub = null;
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // select main and sub attributes
    const main = this.getAttribute('main');
    const sub = this.getAttribute('sub');

    // select the nav
    const nav = this.shadowObj.querySelector('ul.nav');

    if (main && sub && nav) {
      this.getOrSetActive(nav, main, sub);

      //activate main nav
      this.activateMainNav(nav);
    }
  }

  activateMainNav = nav => {
    const tabs = nav.querySelectorAll('li.nav-item');

    // add event listener to each tab
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        // check if tab is not active
        if (this.active_tab.dataset.nav !== tab.dataset.nav) {
          // remove active icon
          this.removeActiveIcon(this.active_tab);

          // remove active class from the active tab
          this.active_tab.classList.remove('active');

          // add active class to the tab
          tab.classList.add('active');

          // activate: sub first child
          const sub = tab.querySelector('ol > li:first-child');
          if (sub) {
            // remove active class from the active sub
            this.active_sub.classList.remove('current');

            // add active class to the sub
            sub.classList.add('current');

            // set the active sub
            this.active_sub = sub;
          }

          // set the active tab
          this.active_tab = tab;

          // set the active icon
          this.setActiveIcon(tab);
        }
      });
    });
  }

  getOrSetActive = (nav, main, sub) => {
    const activeTab = nav.querySelector('li.nav-item.active');

    // check if activeTab is not null
    if (activeTab) {
      // select the inner link: active
      const activeLink = activeTab.querySelector('ol > li.current');

      // check if activeLink is not null
      if (activeLink) {
        // set the active tab
        this.active_tab = activeTab;
        this.active_sub = activeLink;

        // set the active icon
        this.setActiveIcon(activeTab);

        return;
      }
    }

    // set the active tab
    this.setActiveTab(nav, main, sub);
  }

  setActiveTab = (nav, main, sub) => {
    // set the active tab
    const mainTab = nav.querySelector(`li.nav-item.${main}`);

    if (mainTab) {
      const subTab = mainTab.querySelector(`ol > li.${sub}`);

      // add active class to the active tab
      if (subTab) {
        mainTab.classList.add('active');
        subTab.classList.add('current');

        // set the active tab
        this.active_tab = mainTab;
        this.active_sub = subTab;

        // set the active icon
        this.setActiveIcon(mainTab);
      }
    }
  }

  setActiveIcon = activeTab => {
    const activeLink = activeTab.querySelector('.link > svg');
    if (activeLink) {
      activeLink.innerHTML = this.getActiveIcon();
    }
  }

  removeActiveIcon = activeTab => {
    const activeLink = activeTab.querySelector('.link > svg');
    if (activeLink) {
      activeLink.innerHTML = this.getInactiveIcon();
    }
  }

  getActiveIcon = () => {
    return /* html */`
      <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    `;
  }

  getInactiveIcon = () => {
    return /* html */`
      <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    `;
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      ${this.getFormationNav()}
    `;
  }

  getFormationNav = () => {
    return /* html */`
      <ul class="nav">
        ${this.getOverview()}
        ${this.getFormations()}
        ${this.getCommittees()}
        ${this.getOffices()}
        ${this.getMembers()}
        ${this.getAllocations()}
        ${this.getMeetings()}
        ${this.getAppointments()}
        ${this.getReports()}
        ${this.getTickets()}
      </ul>
    `;
  }

  getOverview = () => {
    return /* html */`
      <li class="nav-item overview" data-nav="overview">
        <div class="link">
          <a href="/formation/overview">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <circle cx="12" cy="18" r="3" stroke="currentColor" stroke-width="1.8"></circle>
              <path d="M12 15V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M22 13C22 7.47715 17.5228 3 12 3C6.47715 3 2 7.47715 2 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
            <span class="text">Overview</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/meetings/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="upcoming" data-nav="upcoming">
            <a href="/formation/meetings/upcoming">
              <span class="text">Upcoming</span>
            </a>
          </li>
          <li class="past" data-nav="past">
            <a href="/formation/meetings/past">
              <span class="text">Past</span>
            </a>
          </li>
          <li class="attendance" data-nav="attendance">
            <a href="/formation/meetings/attendance">
              <span class="text">Attendance</span>
            </a>
          </li>
          <li class="minutes" data-nav="minutes">
            <a href="/formation/meetings/minutes">
              <span class="text">Minutes</span>
            </a>
          </li>
          <li class="hansard" data-nav="hansard">
            <a href="/formation/meetings/hansard">
              <span class="text">Hansard</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getReports = () => {
    return /* html */`
      <li class="nav-item reports" data-nav="reports">
        <div class="link">
          <a href="/formation/reports">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M20.4999 10.5V10C20.4999 6.22876 20.4999 4.34315 19.3284 3.17157C18.1568 2 16.2712 2 12.4999 2H11.5C7.72883 2 5.84323 2 4.67166 3.17156C3.50009 4.34312 3.50007 6.22872 3.50004 9.99993L3.5 14.5C3.49997 17.7874 3.49996 19.4312 4.40788 20.5375C4.57412 20.7401 4.75986 20.9258 4.96242 21.0921C6.06877 22 7.71249 22 10.9999 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7.5 7H16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7.5 12H13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20.5 20L20.5 17C20.5 15.5706 19.1569 14 17.5 14C15.8431 14 14.5 15.5706 14.5 17L14.5 20.5C14.5 21.3284 15.1716 22 16 22C16.8284 22 17.5 21.3284 17.5 20.5V17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Reports</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/reports/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="announcement" data-nav="announcement">
            <a href="/formation/reports/announcement">
              <span class="text">Announcements</span>
            </a>
          </li>
          <li class="report" data-nav="report">
            <a href="/formation/reports/report">
              <span class="text">Reports</span>
            </a>
          </li>
          <li class="update" data-nav="update">
            <a href="/formation/reports/update">
              <span class="text">Updates</span>
            </a>
          </li>
          <li class="memo" data-nav="memo">
            <a href="/formation/reports/memo">
              <span class="text">Memo</span>
            </a>
          </li>
          <li class="letter" data-nav="letter">
            <a href="/formation/reports/letter">
              <span class="text">Letter</span>
            </a>
          </li>
          <li class="notice" data-nav="notice">
            <a href="/formation/reports/notice">
              <span class="text">Notice</span>
            </a>
          </li>
          <li class="papers" data-nav="papers">
            <a href="/formation/reports/papers">
              <span class="text">Papers</span>
            </a>
          </li>
          <li class="files" data-nav="files">
            <a href="/formation/reports/files">
              <span class="text">Files</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getTickets = () => {
    return /* html */`
      <li class="nav-item tickets" data-nav="tickets">
        <div class="link">
          <a href="/formation/tickets">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M11.5 12.5L15 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Support</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/tickets/all">
              <span class="text">All Tickets</span>
            </a>
          </li>
          <li class="open" data-nav="open">
            <a href="/formation/tickets/open">
              <span class="text">Open</span>
            </a>
          </li>
          <li class="closed" data-nav="closed">
            <a href="/formation/tickets/closed">
              <span class="text">Closed</span>
            </a>
          </li>
          <li class="appointments" data-nav="appointments">
            <a href="/formation/tickets/appointments">
              <span class="text">Appointments</span>
            </a>
          </li>
          <li class="slots" data-nav="slots">
            <a href="/formation/tickets/slots">
              <span class="text">Time Slots</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getSupport = () => {
    return /* html */`
      <li class="nav-item support" data-nav="support">
        <div class="link">
          <a href="/formation/support">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span class="text">Support</span>
          </a>
        </div>
        <ol class="sub-nav">
          <li class="dashboard current" data-nav="dashboard">
            <a href="/formation/overview">
              <span class="text">Dashboard</span>
            </a>
          </li>
          <li class="stats" data-nav="stats">
            <a href="/formation/stats">
              <span class="text">Statistics</span>
            </a>
          </li>
          <li class="structure" data-nav="structure">
            <a href="/formation/structure">
              <span class="text">Structure</span>
            </a>
          </li>
          <li class="hierarchy" data-nav="hierarchy">
            <a href="/formation/hierarchy">
              <span class="text">Hierarchy</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getFormations = () => {
    return /* html */`
      <li class="nav-item formations" data-nav="formations">
        <div class="link">
          <a href="/formation/formations">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M12 2H6C3.518 2 3 2.518 3 5V22H15V5C15 2.518 14.482 2 12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M18 8H15V22H21V11C21 8.518 20.482 8 18 8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M8 6L10 6M8 9L10 9M8 12L10 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11.5 22V18C11.5 17.0572 11.5 16.5858 11.2071 16.2929C10.9142 16 10.4428 16 9.5 16H8.5C7.55719 16 7.08579 16 6.79289 16.2929C6.5 16.5858 6.5 17.0572 6.5 18V22" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            </svg>
            <span class="text">Formations</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/formations/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="main" data-nav="main">
            <a href="/formation/formations/main">
              <span class="text">Main</span>
            </a>
          </li>
          <li class="sub" data-nav="sub">
            <a href="/formation/formations/sub">
              <span class="text">Sub</span>
            </a>
          </li>
          <li class="committee" data-nav="committee">
            <a href="/formation/formations/committee">
              <span class="text">Committee</span>
            </a>
          </li>
          <li class="bureau" data-nav="bureau">
            <a href="/formation/formations/bureau">
              <span class="text">Bureau</span>
            </a>
          </li>
          <li class="panel" data-nav="panel">
            <a href="/formation/formations/panel">
              <span class="text">Panel</span>
            </a>
          </li>
          <li class="branch" data-nav="branch">
            <a href="/formation/formations/branch">
              <span class="text">Branch</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getCommittees = () => {
    return /* html */`
      <li class="nav-item committees" data-nav="committees">
        <div class="link">
          <a href="/formation/committees">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M15.5 11C15.5 9.067 13.933 7.5 12 7.5C10.067 7.5 8.5 9.067 8.5 11C8.5 12.933 10.067 14.5 12 14.5C13.933 14.5 15.5 12.933 15.5 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15.4827 11.3499C15.8047 11.4475 16.1462 11.5 16.5 11.5C18.433 11.5 20 9.933 20 8C20 6.067 18.433 4.5 16.5 4.5C14.6851 4.5 13.1928 5.8814 13.0173 7.65013" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10.9827 7.65013C10.8072 5.8814 9.31492 4.5 7.5 4.5C5.567 4.5 4 6.067 4 8C4 9.933 5.567 11.5 7.5 11.5C7.85381 11.5 8.19535 11.4475 8.51727 11.3499" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22 16.5C22 13.7386 19.5376 11.5 16.5 11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17.5 19.5C17.5 16.7386 15.0376 14.5 12 14.5C8.96243 14.5 6.5 16.7386 6.5 19.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7.5 11.5C4.46243 11.5 2 13.7386 2 16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Committees</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/committees/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="active" data-nav="active">
            <a href="/formation/committees/active">
              <span class="text">Active</span>
            </a>
          </li>
          <li class="create" data-nav="create">
            <a href="/formation/committees/create">
              <span class="text">Create</span>
            </a>
          </li>
          <li class="manage" data-nav="manage">
            <a href="/formation/committees/manage">
              <span class="text">Manage</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getOffices = () => {
    return /* html */`
      <li class="nav-item offices" data-nav="offices">
        <div class="link">
          <a href="/formation/offices">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M2 22L22 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M3 22V8C3 5.17157 3 3.75736 3.87868 2.87868C4.75736 2 6.17157 2 9 2H15C17.8284 2 19.2426 2 20.1213 2.87868C21 3.75736 21 5.17157 21 8V22" stroke="currentColor" stroke-width="1.8"/>
              <path d="M6 6L10 6M6 10L10 10M14 6L18 6M14 10L18 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M6 22L6 18C6 16.5858 6 15.8787 6.43934 15.4393C6.87868 15 7.58579 15 9 15L15 15C16.4142 15 17.1213 15 17.5607 15.4393C18 15.8787 18 16.5858 18 18L18 22" stroke="currentColor" stroke-width="1.8"/>
              <path d="M10 18L14 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <span class="text">Offices</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/offices/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="office" data-nav="office">
            <a href="/formation/offices/office">
              <span class="text">Office</span>
            </a>
          </li>
          <li class="tool" data-nav="tool">
            <a href="/formation/offices/tool">
              <span class="text">Tool</span>
            </a>
          </li>
          <li class="formation" data-nav="formation">
            <a href="/formation/offices/formation">
              <span class="text">Formation</span>
            </a>
          </li>
          <li class="system" data-nav="system">
            <a href="/formation/offices/system">
              <span class="text">System</span>
            </a>
          </li>
          <li class="social" data-nav="social">
            <a href="/formation/offices/social">
              <span class="text">Social</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getMembers = () => {
    return /* html */`
      <li class="nav-item members" data-nav="members">
        <div class="link">
          <a href="/formation/members">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M7.5 19.5C7.5 18.5344 7.82853 17.5576 8.63092 17.0204C9.59321 16.3761 10.7524 16 12 16C13.2476 16 14.4068 16.3761 15.3691 17.0204C16.1715 17.5576 16.5 18.5344 16.5 19.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <circle cx="12" cy="11" r="2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></circle>
              <path d="M17.5 11C18.6101 11 19.6415 11.3769 20.4974 12.0224C21.2229 12.5696 21.5 13.4951 21.5 14.4038V14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <circle cx="17.5" cy="6.5" r="2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></circle>
              <path d="M6.5 11C5.38987 11 4.35846 11.3769 3.50256 12.0224C2.77706 12.5696 2.5 13.4951 2.5 14.4038V14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <circle cx="6.5" cy="6.5" r="2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></circle>
            </svg>
            <span class="text">Members</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/members/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="staff" data-nav="staff">
            <a href="/formation/members/staff">
              <span class="text">Staff</span>
            </a>
          </li>
          <li class="member" data-nav="member">
            <a href="/formation/members/member">
              <span class="text">Member</span>
            </a>
          </li>
          <li class="roles" data-nav="roles">
            <a href="/formation/members/roles">
              <span class="text">Roles</span>
            </a>
          </li>
          <li class="requests" data-nav="requests">
            <a href="/formation/members/requests">
              <span class="text">Requests</span>
            </a>
          </li>
          <li class="approvals" data-nav="approvals">
            <a href="/formation/members/approvals">
              <span class="text">Approvals</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getAllocations = () => {
    return /* html */`
      <li class="nav-item allocations" data-nav="allocations">
        <div class="link">
          <a href="/formation/allocations">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M18.9 8C18.9656 7.67689 19 7.34247 19 7C19 4.23858 16.7614 2 14 2C11.2386 2 9 4.23858 9 7C9 7.34247 9.03443 7.67689 9.10002 8" stroke="currentColor" stroke-width="1.8" />
              <path d="M7 7.99324H16C18.8284 7.99324 20.2426 7.99324 21.1213 8.87234C22 9.75145 22 11.1663 22 13.9961V15.9971C22 18.8269 22 20.2418 21.1213 21.1209C20.2426 22 18.8284 22 16 22H10C6.22876 22 4.34315 22 3.17157 20.8279C2 19.6557 2 17.7692 2 13.9961V11.9952C2 8.22211 2 6.33558 3.17157 5.16344C4.11466 4.2199 5.52043 4.03589 8 4H10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text">Allocations</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/allocations/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="pending" data-nav="pending">
            <a href="/formation/allocations/pending">
              <span class="text">Pending</span>
            </a>
          </li>
          <li class="approved" data-nav="approved">
            <a href="/formation/allocations/approved">
              <span class="text">Approved</span>
            </a>
          </li>
          <li class="rejected" data-nav="rejected">
            <a href="/formation/allocations/rejected">
              <span class="text">Rejected</span>
            </a>
          </li>
          <li class="expenditures" data-nav="expenditures">
            <a href="/formation/allocations/expenditures">
              <span class="text">Expenditures</span>
            </a>
          </li>
        </ol>
      </li>
  `;
  }

  getAppointments = () => {
    return /* html */`
      <li class="nav-item appointments" data-nav="appointments">
        <div class="link">
          <a href="/formation/appointments">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M3 9H21M3 9C2.45 9 2 8.55 2 8V5C2 4.45 2.45 4 3 4H21C21.55 4 22 4.45 22 5V8C22 8.55 21.55 9 21 9M3 9V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V9M8 13H16M8 16H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text">Appointments</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/appointments/all">
              <span class="text">All Appointments</span>
            </a>
          </li>
          <li class="slots" data-nav="slots">
            <a href="/formation/appointments/slots">
              <span class="text">Time Slots</span>
            </a>
          </li>
          <li class="formation" data-nav="formation">
            <a href="/formation/appointments/formation">
              <span class="text">Formation</span>
            </a>
          </li>
          <li class="office" data-nav="office">
            <a href="/formation/appointments/office">
              <span class="text">Office</span>
            </a>
          </li>
          <li class="committee" data-nav="committee">
            <a href="/formation/appointments/committee">
              <span class="text">Committee</span>
            </a>
          </li>
          <li class="scheduled" data-nav="scheduled">
            <a href="/formation/appointments/scheduled">
              <span class="text">Scheduled</span>
            </a>
          </li>
          <li class="rescheduled" data-nav="rescheduled">
            <a href="/formation/appointments/rescheduled">
              <span class="text">Rescheduled</span>
            </a>
          </li>
          <li class="cancelled" data-nav="cancelled">
            <a href="/formation/appointments/cancelled">
              <span class="text">Cancelled</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getMeetings = () => {
    return /* html */`
      <li class="nav-item meetings" data-nav="meetings">
        <div class="link">
          <a href="/formation/meetings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M11 8L13 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text">Meetings</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/formation/meetings/all">
              <span class="text">All Meetings</span>
            </a>
          </li>
          <li class="formation" data-nav="formation">
            <a href="/formation/meetings/formation">
              <span class="text">Formation</span>
            </a>
          </li>
          <li class="office" data-nav="office">
            <a href="/formation/meetings/office">
              <span class="text">Office</span>
            </a>
          </li>
          <li class="committee" data-nav="committee">
            <a href="/formation/meetings/committee">
              <span class="text">Committee</span>
            </a>
          </li>
          <li class="attendance" data-nav="attendance">
            <a href="/formation/meetings/attendance">
              <span class="text">Attendance</span>
            </a>
          </li>
          <li class="minutes" data-nav="minutes">
            <a href="/formation/meetings/minutes">
              <span class="text">Minutes</span>
            </a>
          </li>
          <li class="hansard" data-nav="hansard">
            <a href="/formation/meetings/hansard">
              <span class="text">Hansard</span>
            </a>
          </li>
          <li class="schedule" data-nav="schedule">
            <a href="/formation/meetings/schedule">
              <span class="text">Schedules</span>
            </a>
          </li>
        </ol>
      </li>
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
	        width: 3px;
	      }

	      *::-webkit-scrollbar-track {
	        background: var(--scroll-bar-background);
	      }

	      *::-webkit-scrollbar-thumb {
	        width: 3px;
	        background: var(--scroll-bar-linear);
	        border-radius: 50px;
	      }

	      h1,
	      h2,
	      h3,
	      h4,
	      h5,
	      h6 {
	        font-family: inherit;
	      }

	      a {
	        text-decoration: none;
	      }

	      :host {
          font-size: 16px;
          padding: 0;
          margin: 0;
          display: flex;
          height: max-content;
          gap: 0;
          width: 100%;
        }

        ul.nav {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          width: 100%;
        }

        ul.nav > li {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0 0 3px 0;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
        }

        ul.nav > li > .link {
          /* border: 1px solid red; */
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;
          margin:  0;
          width: 100%;
          cursor: pointer;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(0);
        }

        ul.nav > li > .link:hover,
        ul.nav > li.active > .link {
          /* background: var(--gray-background); */
          color: var(--accent-color);
          /* transform: translateX(3px); */
        }

        ul.nav > li > .link > svg {
          width: 16px;
          height: 16px;
          color: var(--text-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        ul.nav > li:hover > .link > svg,
        ul.nav > li.active > .link > svg {
          transform: rotate(180deg);
        }

        ul.nav > li > .link > a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          gap: 5px;
          color: inherit;
        }

        ul.nav > li > .link > a > svg {
          width: 18px;
          height: 18px;
          color: var(--text-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        ul.nav > li:hover > .link > a > svg {
          transform: scale(1.1);
        }

        ul.nav > li > .link > a > span.text {
          font-size: 1rem;
          color: inherit;
        }

        ul.nav > li.active > .link > a > span.text {
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
        }

        ul.nav > li > .sub-nav {
          list-style: none;
          padding: 0;
          margin: 0;
          display: none;
          flex-direction: column;
          gap: 0;
          width: 100%;
          max-height: 0;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(-10px);
        }

        ul.nav > li.active > .sub-nav {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 5px 0;
          max-height: 500px;
          opacity: 1;
          transform: translateY(0);
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        ul.nav > li > .sub-nav > li {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 3px 10px 3px 15px;
          color: var(--nav-color);
          font-family: var(--font-text), sans-serif;
          border-radius: 8px;
          transition: all 0.2s ease-in-out;
          transform: translateX(0);
          opacity: 0.8;
        }

        ul.nav > li > .sub-nav > li:hover,
        ul.nav > li > .sub-nav > li.current {
          color: var(--text-color);
          background: var(--gray-background);
          transform: translateX(8px);
          opacity: 1;
        }

        ul.nav > li > .sub-nav > li > a {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 0 0 5px;
          width: 100%;
          cursor: pointer;
          color: inherit;
          position: relative;
        }

        ul.nav > li > .sub-nav > li > a > span.text {
          font-size: 1rem;
          font-family: inherit;
          color: inherit;
        }

        /* add a hyphen before the text in the anchor tag */
        ul.nav > li > .sub-nav > li > a::before {
          content: "- ";
          color: inherit;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
        }

        ul.nav > li > .sub-nav > li > a > svg {
          width: 16px;
          height: 16px;
          color: var(--text-color);
        }

				@keyframes slideDown {
          0% {
            max-height: 0;
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            max-height: 500px;
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(-5px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        ul.nav > li > .sub-nav > li.current {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
          }
        }

        ul.nav > li.active > .sub-nav > li {
          animation: fadeIn 0.3s ease-out forwards;
        }

        ul.nav > li.active > .sub-nav > li:nth-child(1) { animation-delay: 0.1s; }
        ul.nav > li.active > .sub-nav > li:nth-child(2) { animation-delay: 0.15s; }
        ul.nav > li.active > .sub-nav > li:nth-child(3) { animation-delay: 0.2s; }
        ul.nav > li.active > .sub-nav > li:nth-child(4) { animation-delay: 0.25s; }
        ul.nav > li.active > .sub-nav > li:nth-child(5) { animation-delay: 0.3s; }
        ul.nav > li.active > .sub-nav > li:nth-child(6) { animation-delay: 0.35s; }
        ul.nav > li.active > .sub-nav > li:nth-child(7) { animation-delay: 0.4s; }
        ul.nav > li.active > .sub-nav > li:nth-child(8) { animation-delay: 0.45s; }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          ul.nav > li > .link,
					a {
						cursor: default !important;
          }
				}
	    </style>
    `;
  }
}