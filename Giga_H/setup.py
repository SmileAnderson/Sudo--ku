"""Setup script for the Cyber Hygiene Scanner."""

import os
import sys
import subprocess
from pathlib import Path


def create_directories():
    """Create necessary directories."""
    directories = ["logs", "data", "temp"]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")


def generate_encryption_key():
    """Generate encryption key for the application."""
    try:
        from cryptography.fernet import Fernet
        key = Fernet.generate_key()
        
        print("🔐 Generated encryption key:")
        print(f"   ENCRYPTION_KEY={key.decode()}")
        print("\n⚠️  IMPORTANT: Store this key securely!")
        print("   Add it to your environment variables or .env file")
        
        return key.decode()
    except ImportError:
        print("❌ cryptography package not installed. Run: pip install cryptography")
        return None


def check_dependencies():
    """Check if required system dependencies are available."""
    required_tools = {
        "nmap": "Network mapping tool",
        "dig": "DNS lookup tool",
        "openssl": "SSL/TLS toolkit"
    }
    
    print("🔍 Checking system dependencies...")
    
    missing_tools = []
    for tool, description in required_tools.items():
        try:
            subprocess.run([tool, "--version"], capture_output=True, check=True)
            print(f"✅ {tool} - {description}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"❌ {tool} - {description} (MISSING)")
            missing_tools.append(tool)
    
    if missing_tools:
        print(f"\n⚠️  Missing tools: {', '.join(missing_tools)}")
        print("Please install the missing tools for full functionality.")
        
        if sys.platform.startswith('win'):
            print("\nFor Windows:")
            print("- Install nmap from: https://nmap.org/download.html")
            print("- Install OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html")
        elif sys.platform.startswith('linux'):
            print("\nFor Linux (Ubuntu/Debian):")
            print("sudo apt-get update")
            print("sudo apt-get install nmap dnsutils openssl")
        elif sys.platform.startswith('darwin'):
            print("\nFor macOS:")
            print("brew install nmap bind openssl")


def create_env_file():
    """Create .env file from template."""
    env_example = Path("env.example")
    env_file = Path(".env")
    
    if env_example.exists() and not env_file.exists():
        # Copy example to .env
        with open(env_example, 'r') as source:
            content = source.read()
        
        with open(env_file, 'w') as target:
            target.write(content)
        
        print("✅ Created .env file from template")
        print("   Please edit .env with your configuration")
    elif env_file.exists():
        print("ℹ️  .env file already exists")
    else:
        print("❌ env.example not found")


def install_python_dependencies():
    """Install Python dependencies."""
    print("📦 Installing Python dependencies...")
    
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Python dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Python dependencies")
        print("   Please run: pip install -r requirements.txt")


def main():
    """Main setup function."""
    print("🛠️  Setting up Cyber Hygiene Scanner")
    print("=" * 50)
    
    # Create directories
    create_directories()
    print()
    
    # Install Python dependencies
    install_python_dependencies()
    print()
    
    # Check system dependencies
    check_dependencies()
    print()
    
    # Create .env file
    create_env_file()
    print()
    
    # Generate encryption key
    encryption_key = generate_encryption_key()
    print()
    
    print("🎉 Setup completed!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your configuration")
    if encryption_key:
        print(f"2. Add ENCRYPTION_KEY={encryption_key} to your .env file")
    print("3. Start services with: docker-compose up -d")
    print("4. Or run development server: python run_dev.py")
    print("5. Start worker process: python run_worker.py")
    print("\n📚 Documentation: http://localhost:8000/docs")


if __name__ == "__main__":
    main()
