<div class = 'blocker'>
    <select class = 'i1'>
        <option value='schedule1'>ตารางที่ 1</option>
        <option value='schedule2'>ตารางที่ 2</option>
        <option value='schedule3'>ตารางที่ 3</option>
    </select>
    <div class = 'menu-container'>
        <button on:click|stopPropagation={toggleMenu()} class="menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-icon lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
        <div class="dropdown-content" class:show={isMenuOpen}>
            <a on:click={toggleMenu()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-line-icon lucide-pencil-line"><path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                แก้ไขชื่อ</a>
            <a on:click={toggleMenu()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                ทำสำเนา</a>
            <a on:click={toggleMenu()}> 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                เพิ่มตาราง</a>
            <a on:click={toggleMenu()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                ตั้งเป็นตารางหลัก</a>
            <a on:click={toggleMenu()} class='delete-option'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                ลบตาราง</a>
        </div>
    </div>
</div>
<style>
    .blocker{
        display: flex;
        gap: 10px;
        align-items: center;
    }
    .i1{
        border: 1px solid grey;
        border-radius: 8px;
        color : black;
        padding: 5px;
        width: 200px;
    }
    .menu-btn {
        background: none;
        cursor: pointer;
        padding: 8px;
        font-size: 20px; /* Made dots visible */
        border-radius: 50%;
        transition: background-color 0.2s;
        border: 1px solid grey;
        border-radius: 8px;
        color : black;
        padding: 5px;
    }
    .menu-btn:hover {
            background-color: #f0f0f0; /* Light gray hover effect */
    }
    .menu-container {
        position: relative; 
    }
    .dropdown-content {
        display: none;
        position: absolute;
        right: 0;
        top: 100%; /* Pushes menu below button */
        background-color: #ffffff;
        min-width: 180px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        overflow: hidden;
    }
    .dropdown-content a {
        /* Flexbox makes them align in a row */
        display: flex;
        align-items: center; 
        gap: 10px; /* Adds space between icon and text */
        
        /* Your existing styles */
        color: #333;
        padding: 12px 16px;
        text-decoration: none;
        font-family: Arial, sans-serif;
        font-size: 14px;
        cursor: pointer;
    }
    .dropdown-content a svg {
        width: 18px; 
        height: 18px;
    }
    .show {
            display: block;
        }
    .dropdown-content a.delete-option {
    color: #d32f2f; /* Red text */
    }   
</style>
<script>
    let isMenuOpen = false;
    function toggleMenu() {
        isMenuOpen = !isMenuOpen
    }
    function handleWindowClick(event) {
    if (isMenuOpen && !event.target.closest('.menu-container')) {
      isMenuOpen = false;
    }
  }
    
    
</script>
<svelte:window on:click={handleWindowClick} />