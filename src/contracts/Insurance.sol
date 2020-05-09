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
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        uint256 insurancePrice,
        address payable owner,
        address payable insuranceOwner,
        bool purchased,
        bool insurancePurchased
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        uint256 insurancePrice,
        address payable owner,
        address payable insuranceOwner,
        bool purchased,
        bool insurancePurchased
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

    function createProduct(
        string memory _name,
        uint256 _price,
        uint256 _insurancePrice
    ) public {
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
            true
        );
    }
}
