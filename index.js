// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyAkm8vb-bxQ01OSVMBESI0to7gYg_KK17w",
    authDomain: "imperiumtoken-463a2.firebaseapp.com",
    projectId: "imperiumtoken-463a2",
    storageBucket: "imperiumtoken-463a2.firebasestorage.app",
    messagingSenderId: "448327216356",
    appId: "1:448327216356:web:88aa7422e7e1bf39fd90f1",
    measurementId: "G-F9JQTR306R"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // App State
  const state = {
    loggedIn: false,
    currentUser: null,
    tokens: [
      {
        id: 1,
        name: "Julius Caesar",
        price: 8,
        rarity: "Common",
        description: "O pré fundador de Roma. Compre esse token para iniciar sua jornada e ganhar seus primeiros pontos.",
        image: "images/cyberjuliocesar.png"
      },
      {
        id: 2,
        name: "Augustus",
        price: 16,
        rarity: "Uncommon",
        description: "Primeiro imperador de Roma, criando o período chamado Pax Romana. Esse é o token que rende mais rápido que os demais.",
        image: "images/cyberaugustus.png"
      },
      {
        id: 3,
        name: "Nero",
        price: 40,
        rarity: "Rare",
        description: "Imperador considerado tirano e cruel por muitos historiedades. Compradores desse token, além de receberem seu lucro, concorrem á premiações em dinheiro todo mês.",
        image: "images/cybernero.png"
      },
      {
        id: 4,
        name: "Trajan",
        price: 80,
        rarity: "Epic",
        description: "Considerado o imperador que entregou o ápice de Roma. Compradores desse token, além de receberem seu lucro, concorrem á ganhar cupons de desconto equivalente ao quanto gastou comprando esse token. ",
        image: "images/cybertrajano.png"
      },
      {
        id: 5,
        name: "Marcus Aurelius",
        price: 400,
        rarity: "Legendary",
        description: "Imperador e filósofo, criador do estoicismo. Esse token rende 50 reais de lucro ao valorizar, e compradores concorrem todo mês á um prêmio de R$1.000,00 em dinheiro ou R$2.000,00 em desconto.",
        image: "images/cyberaurelio.png"
      },
      {
        id: 6,
        name: "Constantine",
        price: 800,
        rarity: "Mythic",
        description: "Primeiro imperador de Roma considerado cristão. Este token lhe gera benefícios customizados, personalizados pela equipe Stein.",
        image: "images/cyberconstantino.png"
      }
    ],
    whatsappNumbers: [
      '554891002305',
      '554891809745',
      '554888398770',
        '554884183802',
        '554891404663',
        '5548984330340'
        
        
    ]
  };
  
  // DOM Elements
  const loginScreen = document.getElementById('loginScreen');
  const registerScreen = document.getElementById('registerScreen');
  const app = document.getElementById('app');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const registerLink = document.getElementById('registerLink');
  const loginLink = document.getElementById('loginLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const creditsDisplay = document.getElementById('credits');
  const scoreDisplay = document.getElementById('score');
  const inventoryCount = document.getElementById('inventoryCount');
  const buySection = document.getElementById('buySection');
  const viewSection = document.getElementById('viewSection');
  const buyTab = document.getElementById('buyTab');
  const viewTab = document.getElementById('viewTab');
  const inventoryItems = document.getElementById('inventoryItems');
  const inventoryBtn = document.getElementById('inventoryBtn');
  const inventoryModal = document.getElementById('inventoryModal');
  const closeInventoryModal = document.getElementById('closeInventoryModal');
  const modalInventoryItems = document.getElementById('modalInventoryItems');
  const purchaseModal = document.getElementById('purchaseModal');
  const closePurchaseModal = document.getElementById('closePurchaseModal');
  const purchaseMessage = document.getElementById('purchaseMessage');
  const scoreAdded = document.getElementById('scoreAdded');
  const getCreditsBtn = document.getElementById('getCreditsBtn');
  const getCreditsModal = document.getElementById('getCreditsModal');
  const closeGetCreditsModal = document.getElementById('closeGetCreditsModal');
  const adminModal = document.getElementById('adminModal');
  const closeAdminModal = document.getElementById('closeAdminModal');
  const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
  const adminSearchEmail = document.getElementById('adminSearchEmail');
  const adminSearchBtn = document.getElementById('adminSearchBtn');
  const adminUsersTable = document.getElementById('adminUsersTable');
  
  // Firebase Functions
  async function saveUser(user) {
    try {
      await db.collection('users').doc(user.email).set(user);
      console.log('User saved successfully');
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }
  
  async function getUserByEmail(email) {
    try {
      const doc = await db.collection('users').doc(email).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
  
  async function getAllUsers() {
    try {
      const snapshot = await db.collection('users').get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
  
  async function checkAdminUserExists() {
    const adminUser = await getUserByEmail("admin@imperium.com");
    if (!adminUser) {
      const defaultAdmin = {
        email: "admin@imperium.com",
        username: "Admin",
        password: "admin123",
        credits: 100000,
        score: 0,
        inventory: [],
        isAdmin: true
      };
      await saveUser(defaultAdmin);
    }
  }
  
  // Check for remembered user
  async function checkRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const user = JSON.parse(rememberedUser);
      document.getElementById('email').value = user.email;
      document.getElementById('password').value = user.password;
      document.getElementById('remember').checked = true;
    }
  }
  
  // Show register screen
  function showRegisterScreen(e) {
    e.preventDefault();
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'flex';
  }
  
  // Show login screen
  function showLoginScreen(e) {
    e.preventDefault();
    registerScreen.style.display = 'none';
    loginScreen.style.display = 'flex';
  }
  
  // Handle registration
  async function handleRegister(e) {
    e.preventDefault();
  
    const email = document.getElementById('regEmail').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
  
    // Validate inputs
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      alert('Email already registered!');
      return;
    }
  
    // Create new user
    const newUser = {
      email,
      username,
      password,
      credits: 0,
      score: 0,
      inventory: [],
      isAdmin: false
    };
  
    await saveUser(newUser);
  
    // Auto-login
    state.currentUser = newUser;
    state.loggedIn = true;
    registerScreen.style.display = 'none';
    app.style.display = 'block';
    updateUI();
  
    alert('Registration successful! You have been logged in.');
  }
  
  // Handle login
  async function handleLogin(e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
  
    // Find user
    const user = await getUserByEmail(email);
  
    if (!user || user.password !== password) {
      alert('Invalid email or password!');
      return;
    }
  
    // Remember user if checkbox is checked
    if (remember) {
      localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem('rememberedUser');
    }
  
    // Login user
    state.currentUser = user;
    state.loggedIn = true;
    loginScreen.style.display = 'none';
    app.style.display = 'block';
    updateUI();
  }
  
  // Handle logout
  function handleLogout() {
    state.currentUser = null;
    state.loggedIn = false;
    app.style.display = 'none';
    loginScreen.style.display = 'flex';
    loginForm.reset();
  }
  
  // Update UI elements
  function updateUI() {
    if (!state.currentUser) return;
  
    creditsDisplay.textContent = state.currentUser.credits.toLocaleString();
    scoreDisplay.textContent = state.currentUser.score.toLocaleString();
    inventoryCount.textContent = state.currentUser.inventory.length;
  }
  
  // Affect random users when tokens are purchased
  async function affectRandomUsers(token, quantity) {
    const allUsers = await getAllUsers();
    
    // Find all users who have this token (excluding the buyer)
    const eligibleUsers = allUsers.filter(user =>
      user.email !== state.currentUser.email &&
      user.inventory.some(t => t.id === token.id)
    );
  
    for (let i = 0; i < quantity; i++) {
      if (eligibleUsers.length > 0) {
        // Randomly select a user
        const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
        const affectedUser = eligibleUsers[randomIndex];
  
        // Find the token in the user's inventory
        const tokenIndex = affectedUser.inventory.findIndex(t => t.id === token.id);
  
        if (tokenIndex !== -1) {
          // Remove 1 token
          affectedUser.inventory.splice(tokenIndex, 1);
  
          // Add score (token price)
          affectedUser.score += token.price;
  
          // Save the updated user
          await saveUser(affectedUser);
  
          console.log(`User ${affectedUser.email} gained ${token.price} points and lost 1 ${token.name} token`);
        }
      }
    }
  }
  
  // Render token cards for purchase
  function renderTokenCards() {
    buySection.innerHTML = '';
  
    state.tokens.forEach(token => {
      const card = document.createElement('div');
      card.className = 'token-card bg-imperium-darker rounded-xl overflow-hidden border border-imperium-cyan p-6 holo-graphic-effect relative';
      card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold title-font glow-cyan">${token.name}</h3>
          <span class="px-2 py-1 text-xs rounded-full ${token.rarity === 'Mythic' ? 'bg-red-600 text-white' :
          token.rarity === 'Legendary' ? 'bg-yellow-500 text-black' :
            token.rarity === 'Epic' ? 'bg-purple-600 text-white' :
              token.rarity === 'Rare' ? 'bg-blue-600 text-white' :
                token.rarity === 'Uncommon' ? 'bg-green-600 text-white' :
                  'bg-gray-600 text-white'
        }">${token.rarity}</span>
        </div>
        <div class="flex justify-center mb-4">
          <img src="${token.image}" alt="${token.name}" class="h-32 object-contain">
        </div>
        <p class="text-gray-300 text-sm mb-4">${token.description}</p>
        
        <div class="quantity-selector">
          <button class="quantity-btn decrement" data-id="${token.id}">-</button>
          <input type="number" min="1" value="1" class="quantity-input" data-id="${token.id}">
          <button class="quantity-btn increment" data-id="${token.id}">+</button>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold glow-cyan">
            <span class="total-price" data-id="${token.id}">${token.price.toLocaleString()}</span> CR
          </span>
          <button class="buy-btn px-4 py-2 bg-imperium-cyan text-imperium-dark font-bold rounded-lg hover:opacity-90" data-id="${token.id}">
            BUY
          </button>
        </div>
      `;
  
      buySection.appendChild(card);
    });
  
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', handleQuantityChange);
    });
  
    // Add event listeners to quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', updateTotalPrice);
      input.addEventListener('input', updateTotalPrice);
    });
  
    // Add event listeners to buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', handleBuy);
    });
  }
  
  // Handle quantity changes
  function handleQuantityChange(e) {
    const tokenId = parseInt(e.target.getAttribute('data-id'));
    const input = document.querySelector(`.quantity-input[data-id="${tokenId}"]`);
    let value = parseInt(input.value) || 1;
  
    if (e.target.classList.contains('increment')) {
      value++;
    } else if (e.target.classList.contains('decrement')) {
      value = Math.max(1, value - 1);
    }
  
    input.value = value;
    updateTotalPrice({ target: input });
  }
  
  // Update total price when quantity changes
  function updateTotalPrice(e) {
    const tokenId = parseInt(e.target.getAttribute('data-id'));
    const quantity = parseInt(e.target.value) || 1;
    const token = state.tokens.find(t => t.id === tokenId);
    const totalPriceElement = document.querySelector(`.total-price[data-id="${tokenId}"]`);
  
    if (token && totalPriceElement) {
      totalPriceElement.textContent = (token.price * quantity).toLocaleString();
    }
  }
  
  // Handle token purchase
  async function handleBuy(e) {
    if (!state.currentUser) return;
  
    const tokenId = parseInt(e.target.getAttribute('data-id'));
    const token = state.tokens.find(t => t.id === tokenId);
    const quantityInput = document.querySelector(`.quantity-input[data-id="${tokenId}"]`);
    const quantity = parseInt(quantityInput.value) || 1;
    const totalPrice = token.price * quantity;
  
    if (state.currentUser.credits < totalPrice) {
      alert('Você não tem créditos o suficiente. Fale com nossa equipe clicando em Obter Créditos!');
      return;
    }
  
    // Process purchase
    state.currentUser.credits -= totalPrice;
  
    // Add all purchased tokens to inventory
    for (let i = 0; i < quantity; i++) {
      state.currentUser.inventory.push({ ...token });
    }
  
    // Calculate score for buyer (price + 25% per token)
    const scoreIncrease = Math.floor(token.price * 1.25) * quantity;
    state.currentUser.score += scoreIncrease;
  
    // Affect random users
    await affectRandomUsers(token, quantity);
  
    // Save the updated user
    await saveUser(state.currentUser);
    
    updateUI();
  
    // Show confirmation
    if (quantity > 1) {
      purchaseMessage.textContent = `You've acquired ${quantity} ${token.name} tokens!`;
    } else {
      purchaseMessage.textContent = `You've acquired the ${token.name} token!`;
    }
    scoreAdded.textContent = `+${scoreIncrease} to your score`;
    purchaseModal.style.display = 'block';
  }
  
  // Switch between buy/view tabs
  function switchTab(tab) {
    if (tab === 'buy') {
      buySection.style.display = 'grid';
      viewSection.style.display = 'none';
      buyTab.classList.add('border-glow-cyan');
      buyTab.classList.remove('border', 'border-imperium-cyan');
      viewTab.classList.remove('border-glow-cyan');
      viewTab.classList.add('border', 'border-imperium-cyan');
    } else {
      buySection.style.display = 'none';
      viewSection.style.display = 'block';
      viewTab.classList.add('border-glow-cyan');
      viewTab.classList.remove('border', 'border-imperium-cyan');
      buyTab.classList.remove('border-glow-cyan');
      buyTab.classList.add('border', 'border-imperium-cyan');
  
      // Render inventory for viewing
      renderInventoryItems();
    }
  }
  
  // Render inventory items for viewing
  function renderInventoryItems() {
    inventoryItems.innerHTML = '';
  
    if (!state.currentUser || state.currentUser.inventory.length === 0) {
      inventoryItems.innerHTML = `
        <div class="col-span-full text-center py-10">
          <i class="fas fa-box-open text-4xl text-imperium-cyan mb-4"></i>
          <h3 class="text-xl font-bold glow-cyan">YOUR INVENTORY IS EMPTY</h3>
          <p class="text-gray-400 mt-2">Purchase tokens from the market to build your collection</p>
        </div>
      `;
      return;
    }
  
    // Group identical tokens together
    const tokenGroups = {};
    state.currentUser.inventory.forEach(token => {
      if (!tokenGroups[token.id]) {
        tokenGroups[token.id] = {
          token: token,
          count: 1
        };
      } else {
        tokenGroups[token.id].count++;
      }
    });
  
    Object.values(tokenGroups).forEach(group => {
      const token = group.token;
      const count = group.count;
  
      const card = document.createElement('div');
      card.className = 'token-card bg-imperium-darker rounded-xl overflow-hidden border border-imperium-cyan p-6 holo-graphic-effect relative';
      card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold title-font glow-cyan">${token.name}</h3>
          <span class="px-2 py-1 text-xs rounded-full ${token.rarity === 'Mythic' ? 'bg-red-600 text-white' :
          token.rarity === 'Legendary' ? 'bg-yellow-500 text-black' :
            token.rarity === 'Epic' ? 'bg-purple-600 text-white' :
              token.rarity === 'Rare' ? 'bg-blue-600 text-white' :
                token.rarity === 'Uncommon' ? 'bg-green-600 text-white' :
                  'bg-gray-600 text-white'
        }">${token.rarity}</span>
        </div>
        <div class="flex justify-center mb-4">
          <img src="${token.image}" alt="${token.name}" class="h-32 object-contain">
        </div>
        <p class="text-gray-300 text-sm mb-4">${token.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold glow-cyan">Owned: ${count}</span>
          <span class="text-xl font-bold glow-cyan">Value: ${token.price.toLocaleString()} CR</span>
        </div>
      `;
  
      inventoryItems.appendChild(card);
    });
  }
  
  // Open inventory modal
  function openInventoryModal() {
    if (!state.currentUser) return;
  
    modalInventoryItems.innerHTML = '';
  
    if (state.currentUser.inventory.length === 0) {
      modalInventoryItems.innerHTML = `
        <div class="col-span-full text-center py-10">
          <i class="fas fa-box-open text-4xl text-imperium-cyan mb-4"></i>
          <h3 class="text-xl font-bold glow-cyan">YOUR INVENTORY IS EMPTY</h3>
          <p class="text-gray-400 mt-2">Purchase tokens from the market to build your collection</p>
        </div>
      `;
    } else {
      // Group identical tokens together
      const tokenGroups = {};
      state.currentUser.inventory.forEach(token => {
        if (!tokenGroups[token.id]) {
          tokenGroups[token.id] = {
            token: token,
            count: 1
          };
        } else {
          tokenGroups[token.id].count++;
        }
      });
  
      Object.values(tokenGroups).forEach(group => {
        const token = group.token;
        const count = group.count;
  
        const card = document.createElement('div');
        card.className = 'bg-imperium-darker rounded-xl overflow-hidden border border-imperium-cyan p-6';
        card.innerHTML = `
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold title-font glow-cyan">${token.name}</h3>
            <span class="px-2 py-1 text-xs rounded-full ${token.rarity === 'Mythic' ? 'bg-red-600 text-white' :
            token.rarity === 'Legendary' ? 'bg-yellow-500 text-black' :
              token.rarity === 'Epic' ? 'bg-purple-600 text-white' :
                token.rarity === 'Rare' ? 'bg-blue-600 text-white' :
                  token.rarity === 'Uncommon' ? 'bg-green-600 text-white' :
                    'bg-gray-600 text-white'
          }">${token.rarity}</span>
          </div>
          <div class="flex justify-center mb-4">
            <img src="${token.image}" alt="${token.name}" class="h-32 object-contain">
          </div>
          <p class="text-gray-300 text-sm mb-4">${token.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold glow-cyan">Owned: ${count}</span>
            <span class="text-xl font-bold glow-cyan">Value: ${token.price.toLocaleString()} CR each</span>
          </div>
        `;
  
        modalInventoryItems.appendChild(card);
      });
    }
  
    inventoryModal.style.display = 'block';
  }
  
  // Close modal
  function closeModal() {
    inventoryModal.style.display = 'none';
  }
  
  // Render admin users table
  async function renderAdminUsersTable(users = null) {
    const usersToDisplay = users || await getAllUsers();
    adminUsersTable.innerHTML = '';
  
    usersToDisplay.forEach((user, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.email}</td>
        <td>${user.username}</td>
        <td>
          <input type="number" value="${user.score}" class="user-score-input px-2 py-1 bg-imperium-dark border border-imperium-cyan rounded text-white w-20" data-email="${user.email}">
        </td>
        <td>
          <input type="number" value="${user.credits}" class="user-credits-input px-2 py-1 bg-imperium-dark border border-imperium-cyan rounded text-white w-20" data-email="${user.email}">
        </td>
        <td>
          <button class="save-user-btn px-3 py-1 bg-imperium-cyan text-imperium-dark rounded text-sm font-bold" data-email="${user.email}">Save</button>
        </td>
      `;
  
      adminUsersTable.appendChild(row);
    });
  
    // Add event listeners to save buttons
    document.querySelectorAll('.save-user-btn').forEach(btn => {
      btn.addEventListener('click', saveUserChanges);
    });
  }
  
  // Search users by email
  async function searchUsers() {
    const searchTerm = adminSearchEmail.value.toLowerCase();
  
    if (!searchTerm) {
      renderAdminUsersTable();
      return;
    }
  
    const allUsers = await getAllUsers();
    const filteredUsers = allUsers.filter(user =>
      user.email.toLowerCase().includes(searchTerm)
    );
  
    renderAdminUsersTable(filteredUsers);
  }
  
  // Save user changes from admin panel
  async function saveUserChanges(e) {
    const email = e.target.getAttribute('data-email');
    const scoreInput = document.querySelector(`.user-score-input[data-email="${email}"]`);
    const creditsInput = document.querySelector(`.user-credits-input[data-email="${email}"]`);
  
    // Get the user from Firebase
    const user = await getUserByEmail(email);
    if (!user) return;
  
    // Update user data
    user.score = parseInt(scoreInput.value);
    user.credits = parseInt(creditsInput.value);
  
    // Save changes
    await saveUser(user);
  
    // If we're editing the current user, update the UI
    if (state.currentUser && user.email === state.currentUser.email) {
      state.currentUser.score = user.score;
      state.currentUser.credits = user.credits;
      updateUI();
    }
  
    // Show confirmation
    alert(`Changes saved for ${user.email}`);
  }
  
  // WhatsApp integration for credits
  function redirectToWhatsAppForCredits() {
    const randomNumber = state.whatsappNumbers[Math.floor(Math.random() * state.whatsappNumbers.length)];
      const message = "Olá, venho da TokenStein! Gostaria de um link de pagamento para obter tokens! O nome que irá aparecer no meu pagamento é: (Digite seu nome) e meu email da TokenStein é: (Digite seu email aqui)";
    window.open(`https://wa.me/${randomNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }
  
  // WhatsApp integration for points exchange
  function redirectToRandomWhatsApp() {
    const randomNumber = state.whatsappNumbers[Math.floor(Math.random() * state.whatsappNumbers.length)];
    const message = `Olá, venho da TokenStein. Gostaria de trocar meus pontos por: (Escolha entre trocar por dinheiro ou cupom de desconto na loja). E meu de usuário da TokenStein é: `;
    window.open(`https://wa.me/${randomNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }
  
  // Show WhatsApp redirect modal for credits
  function showWhatsAppRedirectModal() {
    getCreditsModal.innerHTML = `
      <div class="modal-content w-full max-w-md bg-imperium-dark border border-imperium-cyan rounded-xl mx-auto mt-40 p-6 border-glow-cyan">
        <div class="text-center mb-6">
          <i class="fas fa-coins text-5xl text-imperium-cyan mb-4"></i>
          <h3 class="text-2xl font-bold title-font glow-cyan">OBTER CRÉDITOS</h3>
          <p class="text-imperium-cyan mt-4">Entre em contato com nosso suporte via WhatsApp para adquirir créditos.</p>
          <p class="text-gray-400 text-sm mt-2">Você será redirecionado aleatoriamente para um de nossos atendentes.</p>
        </div>
        <button id="confirmWhatsAppBtn" class="w-full py-3 px-4 bg-imperium-cyan text-imperium-dark font-bold rounded-lg hover:opacity-90">
          ABRIR WHATSAPP
        </button>
        <button id="closeGetCreditsModal" class="w-full py-3 px-4 bg-gray-600 text-white font-bold rounded-lg hover:opacity-90 mt-4">
          CANCELAR
        </button>
      </div>
    `;
  
    document.getElementById('confirmWhatsAppBtn').addEventListener('click', redirectToWhatsAppForCredits);
    document.getElementById('closeGetCreditsModal').addEventListener('click', () => {
      getCreditsModal.style.display = 'none';
    });
  
    getCreditsModal.style.display = 'block';
  }
  
  // Initialize the app
  async function init() {
    // Initialize Firebase and check for admin user
    await checkAdminUserExists();
    
    // Check for remembered user
    await checkRememberedUser();
    
    // Update UI
    updateUI();
    renderTokenCards();
  
    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    registerLink.addEventListener('click', showRegisterScreen);
    loginLink.addEventListener('click', showLoginScreen);
    logoutBtn.addEventListener('click', handleLogout);
    getCreditsBtn.addEventListener('click', showWhatsAppRedirectModal);
    buyTab.addEventListener('click', () => switchTab('buy'));
    viewTab.addEventListener('click', () => switchTab('view'));
    inventoryBtn.addEventListener('click', openInventoryModal);
    closeInventoryModal.addEventListener('click', closeModal);
    closePurchaseModal.addEventListener('click', () => purchaseModal.style.display = 'none');
    closeAdminModal.addEventListener('click', () => adminModal.style.display = 'none');
    closeAdminModalBtn.addEventListener('click', () => adminModal.style.display = 'none');
    adminSearchBtn.addEventListener('click', searchUsers);
    document.getElementById('whatsappBtn').addEventListener('click', redirectToRandomWhatsApp);
    document.getElementById('whatsappBtnDesktop').addEventListener('click', redirectToRandomWhatsApp);
  
    // Keyboard shortcut for admin panel (t+t+t)
    let keySequence = [];
    const ADMIN_SHORTCUT = ['t', 't', 't'];
  
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      keySequence.push(key);
  
      // Keep only the last 3 keys
      if (keySequence.length > ADMIN_SHORTCUT.length) {
        keySequence.shift();
      }
  
      // Check if sequence matches
      if (keySequence.length === ADMIN_SHORTCUT.length) {
        let match = true;
        for (let i = 0; i < ADMIN_SHORTCUT.length; i++) {
          if (keySequence[i] !== ADMIN_SHORTCUT[i]) {
            match = false;
            break;
          }
        }
  
        if (match && state.currentUser && state.currentUser.isAdmin) {
          adminModal.style.display = 'block';
          renderAdminUsersTable();
          keySequence = [];
        }
      }
    });
  
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === inventoryModal) closeModal();
      if (e.target === purchaseModal) purchaseModal.style.display = 'none';
      if (e.target === getCreditsModal) getCreditsModal.style.display = 'none';
      if (e.target === adminModal) adminModal.style.display = 'none';
    });
  }
  
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
