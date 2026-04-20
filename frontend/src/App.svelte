<script lang="ts">
  import { onMount } from 'svelte';
  
  const API_URL = "http://localhost:3000";
  
  let currentView = 'home'; // home, detail, reader
  let books: any[] = [];
  let currentBookId: number | null = null;
  let currentBook: any = null;
  let chapters: any[] = [];
  let currentChapter: any = null;
  let chapterContents: any[] = [];
  
  let searchQuery = '';
  let searchResults: any[] = [];
  let isSearching = false;

  async function fetchBooks() {
    try {
      const res = await fetch(`${API_URL}/books`);
      const payload = await res.json();
      if (payload.success) books = payload.data;
    } catch (e) {
      console.error(e);
    }
  }

  async function openBook(id: number) {
    try {
      const res = await fetch(`${API_URL}/book?id=${id}`);
      const payload = await res.json();
      if (payload.success) {
        currentBook = payload.data.book;
        chapters = payload.data.chapters;
        currentBookId = id;
        currentView = 'detail';
        window.scrollTo(0, 0);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function openReader(chapterId: number) {
    try {
      const res = await fetch(`${API_URL}/content?chapter_id=${chapterId}`);
      const payload = await res.json();
      if (payload.success) {
        currentChapter = payload.data.chapter;
        chapterContents = payload.data.contents;
        currentView = 'reader';
        window.scrollTo(0, 0);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function search() {
    if (!searchQuery.trim()) {
      isSearching = false;
      return;
    }
    isSearching = true;
    try {
      const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
      const payload = await res.json();
      if (payload.success) {
        searchResults = payload.data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  function goHome() {
    currentView = 'home';
    searchQuery = '';
    isSearching = false;
  }

  function goBackToBook() {
    currentView = 'detail';
  }

  onMount(() => {
    fetchBooks();
  });
</script>

<main class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
  
  <!-- Navigation Header -->
  <header class="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <button class="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl hover:opacity-80 transition-opacity" on:click={goHome}>
        <span class="text-2xl">📚</span>
        <span class="tracking-tight">Maktabah Digital</span>
      </button>

      {#if currentView !== 'home'}
        <button class="text-sm font-medium px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition" on:click={currentView === 'reader' ? goBackToBook : goHome}>
           &larr; {currentView === 'reader' ? 'Kembali ke Daftar Bab' : 'Kembali'}
        </button>
      {/if}
    </div>
  </header>

  <!-- Main Content Area -->
  <div class="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
    
    {#if currentView === 'home'}
      <div class="space-y-10">
        <!-- Hero Section -->
        <div class="text-center space-y-4 py-12">
          <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cari Referensi Kitab dengan Mudah</h1>
          <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Akses koleksi pustaka Islam klasik dan modern, langsung dari perangkat Anda.</p>
          
          <div class="mt-8 relative max-w-xl mx-auto flex items-center shadow-lg rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
            <div class="pl-5 text-slate-400 text-xl">🔍</div>
            <input 
              type="text" 
              bind:value={searchQuery}
              on:keyup={(e) => e.key === 'Enter' && search()}
              placeholder="Cari kata kunci dalam kitab..."
              class="w-full py-4 px-4 bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
            />
            <button on:click={search} class="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
              Cari
            </button>
          </div>
        </div>

        {#if isSearching}
          <div class="space-y-4">
            <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Hasil Pencarian: {searchQuery}</h2>
            {#if searchResults.length === 0}
              <div class="p-8 text-center text-slate-500 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                Tidak ada teks yang cocok.
              </div>
            {:else}
              <div class="grid grid-cols-1 gap-4">
                {#each searchResults as res}
                  <button class="text-left bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition" on:click={() => openReader(res.chapter_id)}>
                    <div class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{res.chapter_title}</div>
                    <p class="text-slate-600 dark:text-slate-300 line-clamp-3 arabic-text text-xl" dir="rtl">{res.content}</p>
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <span class="text-xl">📖</span>
              <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Koleksi Kitab</h2>
            </div>
            
            {#if books.length === 0}
              <div class="p-12 text-center text-slate-500 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                Pustaka masih kosong. Pastikan database terhubung.
              </div>
            {:else}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                {#each books as book}
                  <button on:click={() => openBook(book.id)} class="text-left group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all dark:bg-slate-800 dark:border-slate-700 border border-slate-200 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{book.title}</h3>
                    <p class="text-slate-500 dark:text-slate-400 mt-2">{book.author || 'Anonim'}</p>
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

    {:else if currentView === 'detail'}
      <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 class="text-4xl font-bold mb-2">{currentBook?.title}</h1>
          <p class="text-lg text-slate-500">{currentBook?.author || ''}</p>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">Daftar Bab / Pasal</h2>
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
            {#each chapters as chap, i}
              <button class="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-4 group" on:click={() => openReader(chap.id)}>
                <span class="text-slate-400 dark:text-slate-500 text-sm font-mono w-6 text-center">{i + 1}</span>
                <span class="font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{chap.title}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>

    {:else if currentView === 'reader'}
      <div class="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
        
        <div class="mb-10 text-center">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white inline-block border-b-2 border-indigo-500 pb-2">{currentChapter?.title}</h1>
        </div>

        <div class="bg-[#fcfbf9] dark:bg-[#1a202c] shadow-lg rounded-xl p-8 md:p-12 border border-[#f0ece1] dark:border-slate-800 min-h-[60vh]">
          {#if chapterContents.length === 0}
            <p class="text-center text-slate-500">Isi bab kosong.</p>
          {:else}
            <div class="space-y-8 arabic-text">
              {#each chapterContents as content}
                <div class="text-slate-800 dark:text-slate-200">
                  {content.content}
                </div>
              {/each}
            </div>
          {/if}
        </div>
        
      </div>
    {/if}

  </div>
</main>

<style>
  /* Imports font for modern readable arabic */
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
</style>
