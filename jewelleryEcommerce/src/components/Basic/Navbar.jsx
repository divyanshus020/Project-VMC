import React, { useState } from 'react';
import {
    Input,
    Badge,
    Button,
    Drawer,
    Menu,
    Dropdown
} from 'antd';
import {
    SearchOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    MenuOutlined,
    DownOutlined
} from '@ant-design/icons';

const { Search } = Input;

// Dynamic nav links data
const navLinks = [
    { label: 'Home', href: '#' },
    {
        label: 'Rings',
        dropdown: [
            { label: 'Diamond Rings', key: 'diamond-rings' },
            { label: 'Wedding Rings', key: 'wedding-rings' },
            { label: 'Engagement Rings', key: 'engagement-rings' },
            { divider: true },
            { label: 'Gold Rings', key: 'gold-rings' },
            { label: 'Silver Rings', key: 'silver-rings' }
        ]
    },
    { label: 'Necklaces', href: '#' },
    { label: 'Earrings', href: '#' },
    { label: 'Bracelets', href: '#' },
    { label: 'Collections', href: '#' }
];

const mobileMenuLinks = [
    { icon: '🏠', label: 'Home', key: 'home' },
    {
        icon: '💍', label: 'Rings', key: 'rings', submenu: [
            { label: 'Diamond Rings', key: 'diamond-rings' },
            { label: 'Wedding Rings', key: 'wedding-rings' },
            { label: 'Engagement Rings', key: 'engagement-rings' },
            { label: 'Gold Rings', key: 'gold-rings' }
        ]
    },
    { icon: '📿', label: 'Necklaces', key: 'necklaces' },
    { icon: '👂', label: 'Earrings', key: 'earrings' },
    { icon: '⚜️', label: 'Bracelets', key: 'bracelets' },
    { icon: '✨', label: 'Collections', key: 'collections' }
];

const userMenuItems = [
    { icon: <UserOutlined className="mr-2" />, label: 'My Profile', key: 'profile' },
    { label: 'My Orders', key: 'orders' },
    { label: 'Wishlist', key: 'wishlist' },
    { divider: true },
    { label: 'Login / Register', key: 'login' }
];

const Navbar = () => {
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    // User dropdown menu
    const userMenu = (
        <Menu>
            {userMenuItems.map((item, idx) =>
                item.divider ? <Menu.Divider key={idx} /> :
                    <Menu.Item key={item.key}>{item.icon}{item.label}</Menu.Item>
            )}
        </Menu>
    );

    // Categories dropdown for desktop
    const categoriesMenu = (
        <Menu>
            {navLinks.find(l => l.label === 'Rings').dropdown.map((item, idx) =>
                item.divider ? <Menu.Divider key={idx} /> :
                    <Menu.Item key={item.key}>{item.label}</Menu.Item>
            )}
        </Menu>
    );

    return (
        <>
            {/* Top Header Bar */}
            <div className="bg-gray-900 text-white py-2 hidden md:block">
                <div className="max-w-full mx-auto px-4 flex justify-around items-center text-sm">
                    <div className="flex gap-6">
                        <span>📞 +91-9876543210</span>
                        
                    </div>
                    <div className="flex gap-6">
                        <span>✉️ info@luxegems.com</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center h-16 w-full justify-center ">

                        {/* Logo */}
                        <div className="absolute left-0 flex items-center h-full">
                            <div className="text-2xl font-bold text-yellow-600 flex items-center">
                                <span className="text-3xl mr-2">💎</span>
                                <span className="hidden sm:block">LUXE GEMS</span>
                                <span className="sm:hidden">LG</span>
                            </div>
                        </div>

                        {/* Desktop Navigation Menu */}
                        {/* update this  */}
                        <div className="hidden lg:flex justify-center gap-3  flex-1 items-center">
                            {navLinks.map(link =>
                                link.dropdown ? (
                                    <Dropdown overlay={categoriesMenu} trigger={['hover']} key={link.label}>
                                        <a href="#" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors flex items-center">
                                            {link.label} <DownOutlined className="ml-1 text-xs" />
                                        </a>
                                    </Dropdown>
                                ) : (
                                    <a href={link.href} key={link.label} className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                                        {link.label}
                                    </a>
                                )
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-xs mx-8  relative right-40 justify-center">
                            <Search
                                placeholder="Search diamonds, gold, silver..."
                                allowClear
                                enterButton={
                                    <Button
                                        type="primary"
                                        icon={<SearchOutlined />}
                                        className="bg-yellow-600 border-yellow-600 hover:bg-yellow-700 hover:border-yellow-700"
                                    />
                                }
                                size="middle"
                                className="w-full"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute right-0 flex items-center space-x-3 h-full">
                            {/* User Account */}
                            <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                                <Button
                                    type="text"
                                    icon={<UserOutlined />}
                                    className="text-gray-600 hover:text-yellow-600 hidden sm:flex items-center"
                                >
                                    <span className="ml-1 hidden lg:inline">Account</span>
                                </Button>
                            </Dropdown>

                            {/* Wishlist */}
                            <Badge count={3} size="small" className="hover:scale-105 transition-transform">
                                <Button
                                    type="text"
                                    icon={<HeartOutlined />}
                                    className="text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <span className="ml-1 hidden lg:inline">Wishlist</span>
                                </Button>
                            </Badge>

                            {/* Shopping Cart */}
                            <Badge count={2} size="small" className="hover:scale-105 transition-transform">
                                <Button
                                    type="text"
                                    icon={<ShoppingCartOutlined />}
                                    className="text-gray-600 hover:text-yellow-600 transition-colors"
                                >
                                    <span className="ml-1 hidden lg:inline">Cart</span>
                                </Button>
                            </Badge>

                            {/* Mobile Menu Button */}
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setMobileMenuVisible(true)}
                                className="lg:hidden text-gray-600 hover:text-yellow-600"
                            />
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="md:hidden pb-4">
                        <Search
                            placeholder="Search jewelry..."
                            allowClear
                            enterButton={
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    className="bg-yellow-600 border-yellow-600"
                                />
                            }
                            size="middle"
                        />
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Menu */}
            <Drawer
                title={
                    <div className="flex items-center">
                        <span className="text-2xl mr-2">💎</span>
                        <span className="font-bold text-yellow-600">LUXE GEMS</span>
                    </div>
                }
                placement="right"
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                width={300}
                bodyStyle={{ padding: 0 }}
            >
                <Menu mode="vertical" className="border-0">
                    {mobileMenuLinks.map(link =>
                        link.submenu ? (
                            <Menu.SubMenu key={link.key} title={<span>{link.icon} {link.label}</span>} className="text-base">
                                {link.submenu.map(sub => (
                                    <Menu.Item key={sub.key}>{sub.label}</Menu.Item>
                                ))}
                            </Menu.SubMenu>
                        ) : (
                            <Menu.Item key={link.key} className="text-base py-3">
                                {link.icon} {link.label}
                            </Menu.Item>
                        )
                    )}
                    <Menu.Divider />
                    <Menu.Item key="account" className="text-base py-3">
                        <UserOutlined className="mr-2" />
                        My Account
                    </Menu.Item>
                    <Menu.Item key="orders" className="text-base py-3">
                        📦 My Orders
                    </Menu.Item>
                    <Menu.Item key="track" className="text-base py-3">
                        🚚 Track Order
                    </Menu.Item>
                    <Menu.Item key="support" className="text-base py-3">
                        💬 Customer Support
                    </Menu.Item>
                </Menu>
            </Drawer>
        </>
    );
};

export default Navbar;