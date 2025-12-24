<script>
  // --- 1. CONFIGURATION DATA ---
  const genEdOptions = [
    { id: 'sci', label: 'วิทย์', color: '#F59E0B', bg: '#FFFBEB' },
    { id: 'hum', label: 'มนุษย์', color: '#EC4899', bg: '#FCE7F3' },
    { id: 'soc', label: 'สังคม', color: '#10B981', bg: '#D1FAE5' },
    { id: 'int', label: 'สหฯ', color: '#8B5CF6', bg: '#EDE9FE' }
  ];

  const specialOptions = [
    { id: 'ng1', label: 'Next-Gen 1' },
    { id: 'ng2', label: 'Next-Gen 2' },
    { id: '21st', label: '21st' }
  ];

  const facultyOptions = [
    { id: '21', label: '21-วิศวะ' },
    { id: '22', label: '22-อักษร' },
    { id: '23', label: '23-วิทยา' }
  ];

  const dayOptions = [
    { id: 'mon', label: 'จันทร์', color: '#D97706', bg: '#FFF7ED' },
    { id: 'tue', label: 'อังคาร', color: '#DB2777', bg: '#FDF2F8' },
    { id: 'wed', label: 'พุธ',    color: '#059669', bg: '#ECFDF5' },
    { id: 'thu', label: 'พฤหัส',  color: '#EA580C', bg: '#FFF7ED' },
    { id: 'fri', label: 'ศุกร์',   color: '#2563EB', bg: '#EFF6FF' }
  ];

  const evalOptions = [
    { id: 'su', label: 'S/U' },
    { id: 'grade', label: 'Letter Grade' }
  ];

  // --- 2. STATE ---
  let selectedGenEds = ['sci', 'hum']; 
  let selectedSpecial = ['ng1'];
  let selectedFaculties = ['21'];
  let selectedDays = ['mon', 'tue'];
  let selectedEval = ['su']; 
  
  let startTime = '08:00';
  let endTime = '09:00';
  let fitSchedule = false;
  
  // NEW: No Conditions State
  let noConditions = false;

  let openDropdown = null; 

  // --- 3. HELPER LOGIC ---
  $: activeGenEds = genEdOptions.filter(o => selectedGenEds.includes(o.id));
  $: availableGenEds = genEdOptions.filter(o => !selectedGenEds.includes(o.id));

  $: activeSpecial = specialOptions.filter(o => selectedSpecial.includes(o.id));
  $: availableSpecial = specialOptions.filter(o => !selectedSpecial.includes(o.id));

  $: activeFaculties = facultyOptions.filter(o => selectedFaculties.includes(o.id));
  $: availableFaculties = facultyOptions.filter(o => !selectedFaculties.includes(o.id));

  $: activeDays = dayOptions.filter(o => selectedDays.includes(o.id));
  $: availableDays = dayOptions.filter(o => !selectedDays.includes(o.id));

  $: activeEval = evalOptions.filter(o => selectedEval.includes(o.id));
  $: availableEval = evalOptions.filter(o => !selectedEval.includes(o.id));

  // --- ACTIONS ---

  // NEW: Handle "No Conditions" Checkbox logic
  function handleNoConditionsChange() {
    if (noConditions) {
        // Unchoose everything above
        selectedGenEds = [];
        selectedSpecial = [];
        selectedFaculties = [];
        selectedDays = [];
        // Optional: Reset time if needed
        startTime = '';
        endTime = '';
    }
  }

  function toggleDropdown(name, event) {
    if (event) event.stopPropagation();
    openDropdown = (openDropdown === name) ? null : name;
  }

  function addOption(listName, id) {
    // If user manually adds an option, we must uncheck "No Conditions"
    if (noConditions) noConditions = false;

    if (listName === 'gened') selectedGenEds = [...selectedGenEds, id];
    if (listName === 'special') selectedSpecial = [...selectedSpecial, id];
    if (listName === 'faculty') selectedFaculties = [...selectedFaculties, id];
    if (listName === 'day') selectedDays = [...selectedDays, id];
    if (listName === 'eval') selectedEval = [...selectedEval, id];
    openDropdown = null; 
  }

  function removeOption(listName, id) {
    if (listName === 'gened') selectedGenEds = selectedGenEds.filter(i => i !== id);
    if (listName === 'special') selectedSpecial = selectedSpecial.filter(i => i !== id);
    if (listName === 'faculty') selectedFaculties = selectedFaculties.filter(i => i !== id);
    if (listName === 'day') selectedDays = selectedDays.filter(i => i !== id);
    if (listName === 'eval') selectedEval = selectedEval.filter(i => i !== id);
  }

  function handleWindowClick() {
    openDropdown = null;
  }
</script>

<svelte:window on:click={handleWindowClick} />

<div class="sidebar">
  <div class="header">
    <div class="header-title">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
      <span>ตัวกรอง</span>
    </div>
    <div style="cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  </div>

  <div class="scroll-content">
    
    <div class="form-group">
      <label>ประเภท GenEd</label>
      <div class="multi-select-box" on:click={(e) => toggleDropdown('gened', e)}>
        {#each activeGenEds as item}
          <div class="chip outlined" style="color: {item.color}; border-color: {item.color};">
            {item.label}
            <span class="close-btn" on:click|stopPropagation={() => removeOption('gened', item.id)}>×</span>
          </div>
        {/each}
        {#if activeGenEds.length === 0} <span class="placeholder">Select GenEd...</span> {/if}
        <div class="dropdown-arrow">▼</div>
        
        {#if openDropdown === 'gened'}
          <div class="dropdown-list" on:click|stopPropagation>
            {#each availableGenEds as opt}
              <div class="option-item" style="color: {opt.color}" on:click={() => addOption('gened', opt.id)}>{opt.label}</div>
            {/each}
            {#if availableGenEds.length === 0} <div class="option-item disabled">All selected</div> {/if}
          </div>
        {/if}
      </div>
    </div>

    <div class="form-group">
      <label>ประเภทพิเศษ</label>
      <div class="multi-select-box gray-bg" on:click={(e) => toggleDropdown('special', e)}>
        {#each activeSpecial as item}
          <div class="chip gray-pill">
            {item.label}
            <span class="close-btn" on:click|stopPropagation={() => removeOption('special', item.id)}>×</span>
          </div>
        {/each}
        {#if activeSpecial.length === 0} <span class="placeholder">Select...</span> {/if}
        <div class="dropdown-arrow">▼</div>

        {#if openDropdown === 'special'}
          <div class="dropdown-list">
            {#each availableSpecial as opt}
              <div class="option-item" on:click={() => addOption('special', opt.id)}>{opt.label}</div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="form-group">
      <label>คณะ</label>
      <div class="multi-select-box gray-bg" on:click={(e) => toggleDropdown('faculty', e)}>
        {#each activeFaculties as item}
          <div class="chip gray-pill">
            {item.label}
            <span class="close-btn" on:click|stopPropagation={() => removeOption('faculty', item.id)}>×</span>
          </div>
        {/each}
        {#if activeFaculties.length === 0} <span class="placeholder">Select Faculty...</span> {/if}
        <div class="dropdown-arrow">▼</div>
        {#if openDropdown === 'faculty'}
          <div class="dropdown-list">
            {#each availableFaculties as opt}
              <div class="option-item" on:click={() => addOption('faculty', opt.id)}>{opt.label}</div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="form-group">
      <label>วันในสัปดาห์</label>
      <div class="multi-select-box" on:click={(e) => toggleDropdown('day', e)}>
        {#each activeDays as item}
          <div class="chip pastel" style="background-color: {item.bg}; color: {item.color};">
            {item.label}
            <span class="close-btn" on:click|stopPropagation={() => removeOption('day', item.id)}>×</span>
          </div>
        {/each}
        {#if activeDays.length === 0} <span class="placeholder">Select Days...</span> {/if}
        <div class="dropdown-arrow">▼</div>
        {#if openDropdown === 'day'}
          <div class="dropdown-list">
            {#each availableDays as opt}
              <div class="option-item" style="color: {opt.color}" on:click={() => addOption('day', opt.id)}>{opt.label}</div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="time-row">
        <div class="time-col">
          <label>เวลาเริ่ม</label>
          <div class="input-wrapper">
            <input type="text" bind:value={startTime} />
            <svg class="clock-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="time-col">
          <label>เวลาจบ</label>
          <div class="input-wrapper">
            <input type="text" bind:value={endTime} />
            <svg class="clock-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
    </div>
  
    <div class="form-group checkbox-row">
        <label class="custom-checkbox">
            <input type="checkbox" bind:checked={noConditions} on:change={handleNoConditionsChange}>
            <span class="checkmark"></span>
            <span class="label-text">ไม่กำหนดเงื่อนไขรายวิชา</span>
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </label>
    </div>

    <div class="form-group">
        <label style="margin-bottom: 8px; display:block">Fit my schedule</label>
        <div class="toggle-row">
            <label class="switch">
                <input type="checkbox" bind:checked={fitSchedule}>
                <span class="slider round"></span>
            </label>
            <span class="toggle-label">Fit my schedule <span class="info-icon-circle">ⓘ</span></span>
        </div>
    </div>

    <div class="form-group">
        <label>วิธีการวัดผล</label>
        <div class="multi-select-box gray-bg" on:click={(e) => toggleDropdown('eval', e)}>
          {#each activeEval as item}
            <div class="chip gray-pill">
              {item.label}
              <span class="close-btn" on:click|stopPropagation={() => removeOption('eval', item.id)}>×</span>
            </div>
          {/each}
          {#if activeEval.length === 0} <span class="placeholder">Select...</span> {/if}
          <div class="dropdown-arrow">▼</div>
          {#if openDropdown === 'eval'}
            <div class="dropdown-list">
              {#each availableEval as opt}
                <div class="option-item" on:click={() => addOption('eval', opt.id)}>{opt.label}</div>
              {/each}
            </div>
          {/if}
        </div>
    </div>

  </div> <div class="footer">
      <button class="search-btn">ค้นหา</button>
  </div>
</div>

<style>
  /* --- LAYOUT --- */
  .sidebar {
    width: 320px;
    background: white;
    border: 1px solid #eee;
    padding: 16px;
    font-family: 'Sarabun', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 12px;
  }
  .header {
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;
  }
  .header-title {
    display: flex; align-items: center; gap: 8px;
    font-weight: bold; font-size: 16px; color: #333;
  }
  
  .form-group { margin-bottom: 16px; }
  label { display: block; color: #999; font-size: 13px; margin-bottom: 6px; }

  /* --- MULTI SELECT --- */
  .multi-select-box {
    display: flex; flex-wrap: wrap; gap: 8px;
    padding: 8px 30px 8px 8px;
    border-radius: 12px; min-height: 40px;
    position: relative; background-color: #FAFAFA;
    cursor: pointer; border: 1px solid transparent;
  }
  .multi-select-box:hover { background-color: #F0F0F0; }
  .multi-select-box.gray-bg { background-color: #F3F4F6; }

  .dropdown-list {
    position: absolute; top: 105%; left: 0; right: 0;
    background: white; border: 1px solid #eee;
    border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    z-index: 50; max-height: 200px; overflow-y: auto;
  }
  .option-item { padding: 10px 15px; font-size: 14px; cursor: pointer; }
  .option-item:hover { background-color: #f5f5f5; }
  .option-item.disabled { color: #ccc; cursor: default; }

  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 13px; font-weight: 600;
  }
  .chip.outlined { background: white; border: 1px solid; }
  .chip.gray-pill { background: #D1D5DB; color: #374151; }
  
  .close-btn { cursor: pointer; opacity: 0.6; line-height: 1; }
  .close-btn:hover { opacity: 1; }
  
  .dropdown-arrow {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%); font-size: 10px; color: #999;
  }
  .placeholder { color: #aaa; font-size: 14px; align-self: center; }

  /* --- TIME INPUTS --- */
  .time-row { display: flex; gap: 12px; margin-bottom: 16px; }
  .time-col { flex: 1; }
  .input-wrapper { position: relative; }
  .input-wrapper input {
    width: 100%; padding: 10px 12px; border: none;
    background-color: #F9FAFB; border-radius: 12px;
    color: #333; font-size: 14px; box-sizing: border-box;
  }
  .clock-icon {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%); pointer-events: none;
  }

  /* --- NEW CHECKBOX STYLES --- */
  .checkbox-row { margin-top: -5px; }
  .custom-checkbox {
      display: flex; align-items: center; cursor: pointer; user-select: none;
      font-size: 14px; color: #374151; font-weight: 500;
  }
  .custom-checkbox input {
      position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0;
  }
  .checkmark {
      height: 18px; width: 18px; background-color: #eee;
      border-radius: 4px; margin-right: 10px; position: relative;
      transition: background-color 0.2s;
  }
  .custom-checkbox:hover input ~ .checkmark { background-color: #ddd; }
  .custom-checkbox input:checked ~ .checkmark { background-color: #4F46E5; /* Blue */ }
  
  .checkmark:after {
      content: ""; position: absolute; display: none;
      left: 6px; top: 2px; width: 4px; height: 9px;
      border: solid white; border-width: 0 2px 2px 0;
      transform: rotate(45deg);
  }
  .custom-checkbox input:checked ~ .checkmark:after { display: block; }
  
  .info-icon { margin-left: 6px; color: #666; }

  /* --- TOGGLE --- */
  .toggle-row { display: flex; align-items: center; gap: 10px; }
  .switch {
      position: relative; display: inline-block; width: 44px; height: 24px;
  }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider {
      position: absolute; cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #ccc; transition: .4s;
  }
  .slider:before {
      position: absolute; content: "";
      height: 18px; width: 18px;
      left: 3px; bottom: 3px;
      background-color: white; transition: .4s;
  }
  input:checked + .slider { background-color: #9CA3AF; }
  input:checked + .slider:before { transform: translateX(20px); }
  .slider.round { border-radius: 34px; }
  .slider.round:before { border-radius: 50%; }
  
  .toggle-label {
      font-size: 14px; color: #374151; font-weight: 500;
      display: flex; align-items: center; gap: 5px;
  }
  .info-icon-circle { color: #666; font-size: 16px; cursor: help; }

  /* --- BUTTON --- */
  .search-btn {
      width: 100%; background-color: #E0E7FF; color: #3730A3;
      border: none; padding: 12px; border-radius: 12px;
      font-weight: bold; cursor: pointer; font-size: 16px;
      margin-top: 10px;
  }
  .search-btn:hover { background-color: #C7D2FE; }
</style>