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
        bool claimedRepair
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
        bool claimedRepair
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
        bool claimedRepair
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
        bool claimedRepair
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
        bool claimedRepair
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
            false,
            false,
            false
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
            msg.sender,
            _product.insuranceOwner,
            true,
            true,
            false,
            false
        );
    }

    function claimPolice(uint256 _id) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedRepair, 'repair is claimed for this product');
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
            _product.claimedRepair
        );
    }

    function claimRepair(uint256 _id) public {
      Product memory _product = products[_id];
      require(_product.purchased, 'you have not purchased the product');
      require(_product.insurancePurchased, 'you have not purchased the insurance');
      require(!_product.claimedPolice, 'police is claimed for this product');
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
            true
        );
    }
}

