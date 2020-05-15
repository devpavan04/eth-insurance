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
        bool purchased,
        bool insurancePurchased,
        bool claimedPolice,
        bool claimedRepair,
        bool isStolen,
        bool isRepaired,
        bool isReimbursed,
        bool paidRepairShop
    );

    event InsurancePurchased(
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

     event PoliceClaimed(
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

    event RepairClaimed(
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

    event Stolen(
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

    event Repaired(
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

    event Reimbursed(
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

     event RepairShopPaid(
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
        // Trigger an event
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
        // Fetch the product
        Product memory _product = products[_id];
        // Fetch the owner
        address payable _seller = _product.owner;
        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount, "");
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price, "");
        // Require that the product has not been purchased already
        require(!_product.purchased, "");
        // Require that the buyer is not the seller
        require(_seller != msg.sender, "");
        // Transfer ownership to the buyer
        _product.owner = msg.sender;
        // Mark as purchased
        _product.purchased = true;
        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            _product.insurancePrice,
            msg.sender,
            _product.insuranceOwner,
            true,
            _product.insurancePurchased,
            _product.claimedPolice,
            _product.claimedRepair,
            _product.isStolen,
            _product.isRepaired,
            _product.isReimbursed,
            _product.paidRepairShop
        );
    }

    function purchaseInsurance(uint256 _id) public payable {
        // Fetch the product
        Product memory _product = products[_id];
        // Fetch the owner
        address payable _seller = _product.insuranceOwner;
        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount, "");
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.insurancePrice, "");
        // Require that the product has not been purchased already
        require(_product.purchased, "");
        // Require that the product has not been purchased already
        require(!_product.insurancePurchased, "");
        // Require that the buyer is not the seller
        require(_seller != msg.sender, "");
        // Mark as purchased
        _product.insurancePurchased = true;
        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit InsurancePurchased(
            productCount,
            _product.name,
            _product.price,
            _product.insurancePrice,
            _product.owner,
            _product.insuranceOwner,
            _product.purchased,
            true,
            _product.claimedPolice,
            _product.claimedRepair,
            _product.isStolen,
            _product.isRepaired,
            _product.isReimbursed,
            _product.paidRepairShop
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
      emit PoliceClaimed(
            productCount,
            _product.name,
            _product.price,
            _product.insurancePrice,
            _product.owner,
            _product.insuranceOwner,
            _product.purchased,
            _product.insurancePurchased,
            true,
            _product.claimedRepair,
            _product.isStolen,
            _product.isRepaired,
            _product.isReimbursed,
            _product.paidRepairShop
        );
    }

    function claimRepair(uint256 _id) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedPolice, 'police is claimed for this product');
      require(!_product.claimedRepair, 'repair is claimed for this product');
      _product.claimedRepair = true;
      products[_id] = _product;
      emit RepairClaimed(
            productCount,
            _product.name,
            _product.price,
            _product.insurancePrice,
            _product.owner,
            _product.insuranceOwner,
            _product.purchased,
            _product.insurancePurchased,
            _product.claimedPolice,
            true,
            _product.isStolen,
            _product.isRepaired,
            _product.isReimbursed,
            _product.paidRepairShop
        );
    }

    function stolen(uint256 _id) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedRepair, 'repair service is claimed for this item');
      require(_product.claimedPolice, 'police service should be claimed first');
      _product.isStolen = true;
      products[_id] = _product;
      emit Stolen(
        productCount,
        _product.name,
        _product.price,
        _product.insurancePrice,
        _product.owner,
        _product.insuranceOwner,
        _product.purchased,
        _product.insurancePurchased,
        _product.claimedPolice,
        _product.claimedRepair,
        true,
        _product.isRepaired,
        _product.isReimbursed,
        _product.paidRepairShop
      );
    }

    function repaired(uint _id) public {
       Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedPolice, 'police service is claimed for this item');
      require(_product.claimedRepair, 'repair service should be claimed first');
      _product.isRepaired = true;
      products[_id] = _product;
      emit Repaired(
        productCount,
        _product.name,
        _product.price,
        _product.insurancePrice,
        _product.owner,
        _product.insuranceOwner,
        _product.purchased,
        _product.insurancePurchased,
        _product.claimedPolice,
        _product.claimedRepair,
        _product.isStolen,
        true,
        _product.isReimbursed,
        _product.paidRepairShop

      );
    }

    function reimburse(uint256 _id) public payable {
      Product memory _product = products[_id];
      require(_product.isStolen, 'not stolen');
      address payable _refundTo = _product.owner;
      require(_refundTo != msg.sender, "");
      _product.isReimbursed = true;
      products[_id] = _product;
      // refund the money to the product owner
      address(_refundTo).transfer(msg.value);
      emit Reimbursed(
        productCount,
        _product.name,
        _product.price,
        _product.insurancePrice,
        _product.owner,
        _product.insuranceOwner,
        _product.purchased,
        _product.insurancePurchased,
        _product.claimedPolice,
        _product.claimedRepair,
        _product.isStolen,
        _product.isRepaired,
        true,
        _product.paidRepairShop
      );
    }

    function payRepairShop(uint256 _id, address payable _repairShop) public payable {
      Product memory _product = products[_id];
      uint256 repairCharge = _product.price / 2;
      require(_product.isRepaired, 'not repaired');
      require(msg.value == repairCharge, 'repair charge is not correct');
      _product.paidRepairShop = true;
      products[_id] = _product;
      // add repair amount to repair shop
      address(_repairShop).transfer(msg.value);
      emit RepairShopPaid(
        productCount,
        _product.name,
        _product.price,
        _product.insurancePrice,
        _product.owner,
        _product.insuranceOwner,
        _product.purchased,
        _product.insurancePurchased,
        _product.claimedPolice,
        _product.claimedRepair,
        _product.isStolen,
        _product.isRepaired,
        _product.isReimbursed,
        true
      );
    }
}
