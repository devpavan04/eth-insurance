pragma solidity ^0.5.0;

contract Insurance {

    uint256 public productCount = 0;

    mapping(uint256 => Product) public products;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        uint256 insurancePrice;
        address payable owner;
        address payable insuranceOwner;
        bool purchased;
        bool insurancePurchased;
        bool claimedPolice;
        bool claimedRepair;
        bool isStolen;
        bool isRepaired;
        bool isReimbursed;
        bool paidRepairShop;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        uint256 insurancePrice,
        address payable owner,
        address payable insuranceOwner,
        bool purchased,
        bool insurancePurchased,
        bool claimedPolice,
        bool claimedRepair,
        bool isStolen,
        bool isRepaired,
        bool isReimbursed,
        bool paidRepairShop
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        uint256 insurancePrice,
        address payable owner,
        address payable insuranceOwner,
        bool purchased
    );

    event InsurancePurchased(
        uint256 id,
        string name,
        uint256 price,
        uint256 insurancePrice,
        address payable owner,
        address payable insuranceOwner,
        bool purchased,
        bool insurancePurchased
    );

    event PoliceClaimed(bool claimedPolice);
    event RepairClaimed(bool claimedRepair);
    event Stolen(bool isStolen);
    event NotStolen(bool notStolen);
    event Repaired(bool isRepaired);
    event Reimbursed(bool isReimbursed);
    event RepairShopPaid(bool paidRepairShop);

    function createProduct(string memory _name, uint256 _price, uint256 _insurancePrice) public {
        require(bytes(_name).length > 0, "");
        require(_price > 0, "");
        require(_insurancePrice > 0, "");
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            _insurancePrice,
            msg.sender,
            msg.sender,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        emit ProductCreated(
            productCount,
            _name,
            _price,
            _insurancePrice,
            msg.sender,
            msg.sender,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
    }

    function purchaseProduct(uint256 _id, address _repairShop, address _police) public payable {
        Product memory _product = products[_id];
        address payable _seller = _product.owner;
        require(_product.id > 0 && _product.id <= productCount, "product is not valid");
        require(msg.value >= _product.price, "wrong money value");
        require(!_product.purchased, "product is purchased already");
        require(_seller != msg.sender, "seller is the buyer");
        require(_repairShop != msg.sender, 'repair shop cannot create product');
        require(_police != msg.sender, 'police cannot create product');
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        address(_seller).transfer(msg.value);
        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            _product.insurancePrice,
            msg.sender,
            _product.insuranceOwner,
            true
        );
    }

    function purchaseInsurance(uint256 _id, address _repairShop, address _police) public payable {
        Product memory _product = products[_id];
        address payable _seller = _product.insuranceOwner;
        require(_product.id > 0 && _product.id <= productCount, "product is not valid");
        require(msg.value >= _product.insurancePrice, "wrong money value");
        require(_product.purchased, "product is not purchased");
        require(!_product.insurancePurchased, "insurance is purchased");
        require(_seller != msg.sender, "seller is the buyer");
        require(_repairShop != msg.sender, "repair cannot buy insurance");
        require(_police != msg.sender, "police cannot buy insurance");
        require(msg.sender == _product.owner, "only product owner can buy the insurance");
        _product.insurancePurchased = true;
        products[_id] = _product;
        address(_seller).transfer(msg.value);
        emit InsurancePurchased(
            productCount,
            _product.name,
            _product.price,
            _product.insurancePrice,
            _product.owner,
            _product.insuranceOwner,
            _product.purchased,
            true
        );
    }

    function claimPolice(uint256 _id, address _repairShop, address _police) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedRepair, 'repair is claimed for this product');
      require(!_product.claimedPolice, 'police is claimed for this product');
      require(_product.insuranceOwner != msg.sender, 'seller cannot claim');
      require(_repairShop != msg.sender, "repair cannot claim police");
      require(_police != msg.sender, "police cannot claim police");
      require(msg.sender == _product.owner, "only product owner can claim");
      _product.claimedPolice = true;
      products[_id] = _product;
      emit PoliceClaimed(true);
    }

    function claimRepair(uint256 _id, address _repairShop, address _police) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedPolice, 'police is claimed for this product');
      require(!_product.claimedRepair, 'repair is claimed for this product');
      require(_product.insuranceOwner != msg.sender, 'seller cannot claim');
      require(_repairShop != msg.sender, "repair cannot claim repair");
      require(_police != msg.sender, "police cannot claim repair");
      require(msg.sender == _product.owner, "only product owner can claim");
      _product.claimedRepair = true;
      products[_id] = _product;
      emit RepairClaimed(true);
    }

    function stolen(uint256 _id, address _repairShop, address _police) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedRepair, 'repair service is claimed for this item');
      require(_product.claimedPolice, 'police service should be claimed first');
      require(_product.owner != msg.sender, 'buyer cannot decide if it is stolen or not');
      require(_product.insuranceOwner != msg.sender, 'seller cannot decide if it is stolen or not');
      require(_repairShop != msg.sender, "repair cannot decide stolen or not");
      require(msg.sender == _police, "only police can decide");
      _product.isStolen = true;
      products[_id] = _product;
      emit Stolen(true);
    }

    function repaired(uint _id, address _repairShop, address _police) public {
       Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedPolice, 'police service is claimed for this item');
      require(_product.claimedRepair, 'repair service should be claimed first');
      require(_product.owner != msg.sender, 'buyer cannot decide if it is repaired or not');
      require(_product.insuranceOwner != msg.sender, 'seller cannot decide if it is repaired or not');
      require(_police != msg.sender, "police cannot decide repaired or not");
      require(msg.sender == _repairShop, "only repair can do this");
      _product.isRepaired = true;
      products[_id] = _product;
      emit Repaired(true);
    }

    function reimburse(uint256 _id, address _repairShop, address _police) public payable {
      Product memory _product = products[_id];
      require(_product.isStolen, 'not stolen');
      address payable _refundTo = _product.owner;
      require(_refundTo != msg.sender, "product owner cannot reimburse product to himself");
      require(_repairShop != msg.sender, "repair cannot reimburse");
      require(_police != msg.sender, "police cannot reimburse");
      require(msg.sender == _product.insuranceOwner, "only product shop can do this");
      _product.isReimbursed = true;
      products[_id] = _product;
      address(_refundTo).transfer(msg.value);
      emit Reimbursed(true);
    }

    function payRepairShop(uint256 _id, address payable _repairShop,  address _police) public payable {
      Product memory _product = products[_id];
      uint256 repairCharge = _product.price / 2;
      require(_product.isRepaired, 'not repaired');
      require(msg.value == repairCharge, 'repair charge is not correct');
      require(_repairShop != msg.sender, "repair cannot pay himself");
      require(_police != msg.sender, "police cannot pay the repair");
      require(msg.sender == _product.insuranceOwner, "only product shop can do this");
      _product.paidRepairShop = true;
      products[_id] = _product;
      address(_repairShop).transfer(msg.value);
      emit RepairShopPaid(true);
    }
}
