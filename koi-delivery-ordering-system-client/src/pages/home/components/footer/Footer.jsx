import "./footer.scss";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <h2>
            We are committed to removing barriers of cross-border e-commerce.
          </h2>
        </div>

        <div className="footer-content">
          <div className="footer-column">
            <h4>Address</h4>
            <p>
            No. 2 Nguyen Binh Khiem, Ben Nghe, District 1, Ho Chi Minh City
            </p>
            <h4>Email</h4>
            <p>
              Direct to CEO:{" "}
              <a href="koideliveringsystemswp@gmail.com">koideliveringsystemswp@gmail.com</a>
            </p>
          </div>

          <div className="footer-column">
            <h4>Connect us</h4>
            <p>Email: koideliveringsystemswp@gmail.com</p>
            <p>Phone Number: 0868394782</p>
            <div className="social-icons">
              <a href="#"></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Services</h4>
            <ul>
              <li>
                <a href="#">Cross-border Shipping</a>
              </li>

              <li>
                <a href="#">Air Freight & Customs Clearance</a>
              </li>

              <li>
                <a href="#">Sell in Japan</a>
              </li>
              <li>
                <a href="#">Dropshipping Solution</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Shipping</h4>
            <ul>
              <li>
                <a href="#">Create a Shipment</a>
              </li>
              <li>
                <a href="#">Track & Trace</a>
              </li>
              <li>
                <a href="#">Rates and Transit times</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Deliery KIN 2023 - Premium eCommerce Solutions</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
