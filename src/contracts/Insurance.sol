pragma solidity ^0.5.0;

contract Insurance {
    string public name;
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
        // Require a valid name
        require(bytes(_name).length > 0, "");
        // Require a valid price
        require(_price > 0, "");
        // Require a valid insurance price
        require(_insurancePrice > 0, "");
        // Increment product count
        productCount++;
        // Create the product
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

    function purchaseProduct(uint256 _id) public payable {
        Product memory _product = products[_id];
        address payable _seller = _product.owner;
        require(_product.id > 0 && _product.id <= productCount, "");
        require(msg.value >= _product.price, "");
        require(!_product.purchased, "");
        require(_seller != msg.sender, "");
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

    function purchaseInsurance(uint256 _id) public payable {
        Product memory _product = products[_id];
        address payable _seller = _product.insuranceOwner;
        require(_product.id > 0 && _product.id <= productCount, "");
        require(msg.value >= _product.insurancePrice, "");
        require(_product.purchased, "");
        require(!_product.insurancePurchased, "");
        require(_seller != msg.sender, "");
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

    function claimPolice(uint256 _id) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedRepair, 'repair is claimed for this product');
      require(!_product.claimedPolice, 'police is claimed for this product');
      _product.claimedPolice = true;
      products[_id] = _product;
      emit PoliceClaimed(true);
    }

    function claimRepair(uint256 _id) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedPolice, 'police is claimed for this product');
      require(!_product.claimedRepair, 'repair is claimed for this product');
      _product.claimedRepair = true;
      products[_id] = _product;
      emit RepairClaimed(true);
    }

    function stolen(uint256 _id) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedRepair, 'repair service is claimed for this item');
      require(_product.claimedPolice, 'police service should be claimed first');
      _product.isStolen = true;
      products[_id] = _product;
      emit Stolen(true);
    }

    function repaired(uint _id) public {
       Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedPolice, 'police service is claimed for this item');
      require(_product.claimedRepair, 'repair service should be claimed first');
      _product.isRepaired = true;
      products[_id] = _product;
      emit Repaired(true);
    }

    function reimburse(uint256 _id) public payable {
      Product memory _product = products[_id];
      require(_product.isStolen, 'not stolen');
      address payable _refundTo = _product.owner;
      require(_refundTo != msg.sender, "");
      _product.isReimbursed = true;
      products[_id] = _product;
      address(_refundTo).transfer(msg.value);
      emit Reimbursed(true);
    }

    function payRepairShop(uint256 _id, address payable _repairShop) public payable {
      Product memory _product = products[_id];
      uint256 repairCharge = _product.price / 2;
      require(_product.isRepaired, 'not repaired');
      require(msg.value == repairCharge, 'repair charge is not correct');
      _product.paidRepairShop = true;
      products[_id] = _product;
      address(_repairShop).transfer(msg.value);
      emit RepairShopPaid(true);
    }
}
