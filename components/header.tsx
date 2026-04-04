'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TextInput,
  ActionIcon,
  Menu,
  Avatar,
  Indicator,
  Burger,
  Drawer,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTheme } from '@/components/providers';
import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  BookMarked,
  Home,
  Library,
  Settings,
  LogOut,
} from 'lucide-react';

const navLinks = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Favoritos', href: '/bookmarks', icon: BookMarked },
  { label: 'Explorar', href: '/browse', icon: Library },
];

const resourceLinks = [
  { label: 'Generos', href: '/genres' },
  { label: 'Populares', href: '/popular' },
  { label: 'Novos', href: '/new' },
  { label: 'Aleatorio', href: '/random' },
];

export function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">M</span>
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:inline">
              MangaReader
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Menu shadow="md" width={180} position="bottom-start">
              <Menu.Target>
                <UnstyledButton className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary">
                  Recursos
                  <ChevronDown size={16} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown className="border-border bg-card">
                {resourceLinks.map((link) => (
                  <Menu.Item
                    key={link.href}
                    component={Link}
                    href={link.href}
                    className="text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 md:max-w-md">
            <TextInput
              placeholder="Buscar mangas..."
              leftSection={<Search size={18} className="text-muted-foreground" />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              classNames={{
                input:
                  'bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary',
              }}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <ActionIcon
                variant="subtle"
                onClick={() => toggleColorScheme()}
                className="text-foreground hover:bg-muted"
                size="lg"
                aria-label="Alternar tema"
              >
                {colorScheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </ActionIcon>
            )}
            {!mounted && (
              <ActionIcon
                variant="subtle"
                className="text-foreground hover:bg-muted"
                size="lg"
                aria-label="Alternar tema"
              >
                <div className="h-5 w-5" />
              </ActionIcon>
            )}

            {/* Notifications */}
            <Indicator color="red" size={8} offset={4} processing>
              <ActionIcon
                variant="subtle"
                className="text-foreground hover:bg-muted"
                size="lg"
              >
                <Bell size={20} />
              </ActionIcon>
            </Indicator>

            {/* User Menu */}
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg" radius="xl">
                  <Avatar
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=manga"
                    size="sm"
                    radius="xl"
                  />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown className="border-border bg-card">
                <Menu.Label className="text-muted-foreground">Conta</Menu.Label>
                <Menu.Item
                  leftSection={<BookMarked size={16} />}
                  className="text-foreground hover:bg-muted"
                >
                  Meus Favoritos
                </Menu.Item>
                <Menu.Item
                  leftSection={<Settings size={16} />}
                  className="text-foreground hover:bg-muted"
                >
                  Configuracoes
                </Menu.Item>
                <Menu.Divider className="border-border" />
                <Menu.Item
                  leftSection={<LogOut size={16} />}
                  className="text-destructive hover:bg-muted"
                >
                  Sair
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            {/* Mobile Menu Toggle */}
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className="text-foreground md:hidden"
              size="sm"
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="xs"
        padding="md"
        title="Menu"
        classNames={{
          content: 'bg-card',
          header: 'bg-card border-b border-border',
          title: 'text-foreground font-bold',
          close: 'text-foreground hover:bg-muted',
        }}
      >
        <Stack gap="xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className="flex items-center gap-3 rounded-md p-3 text-foreground transition-colors hover:bg-muted"
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-border pt-2">
            <p className="px-3 pb-2 text-sm font-medium text-muted-foreground">
              Recursos
            </p>
            {resourceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className="block rounded-md p-3 pl-6 text-foreground transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Stack>
      </Drawer>
    </>
  );
}
