import type { FC } from 'hono/jsx'
import type { IconNode } from 'lucide'
import { Activity, Apple, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, AtSign, Bell, Blocks, Bold, Bot, Calendar, Camera, ChartColumn, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Circle, CircleAlert, CircleCheck, CircleDashed, CircleDollarSign, CircleDotDashed, CircleHelp, CircleX, Clock, Code, Cog, Copy, CornerDownRight, CreditCard, Download, Ellipsis, ExternalLink, Eye, File, Filter, Folder, FolderPlus, Handshake, Home, Image, Info, Italic, Kanban, Key, Layers, LayoutGrid, LayoutTemplate, Lightbulb, Link, List, ListFilter, ListOrdered, ListTodo, LoaderCircle, Lock, LogOut, Mail, MapPin, Maximize, Megaphone, Menu, MessageCircle, MessageSquare, Mic, Minimize, Minus, Monitor, Moon, MoreHorizontal, MoreVertical, PanelLeft, Paperclip, Pencil, Phone, Pin, Play, Plus, Quote, Redo, RefreshCw, Rows3, Search, Send, Settings, Share2, Shield, ShoppingCart, Signal, SignalHigh, SignalLow, SignalMedium, Smartphone, Sparkles, SquareCode, SquareTerminal, Star, Store, Strikethrough, Sun, Tablet, Terminal, Trash2, TrendingDown, TrendingUp, TriangleAlert, Underline, Undo, Upload, User, UserPlus, Users, WandSparkles, X, Zap } from 'lucide'

type IconElementProps = {
  class?: string
  [key: string]: unknown
}

type IconProps = IconElementProps & {
  iconNode: IconNode
}

export const Icon: FC<IconProps> = ({
  iconNode,
  class: className,
  ...props
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
    class={className}
    {...(props as Record<string, string | number | boolean | undefined>)}
  >
    {(iconNode as [string, Record<string, string | number | undefined>][]).map(
      ([tag, attrs], index: number) => {
        const Tag = tag as any
        return <Tag key={index} {...attrs} />
      }
    )}
  </svg>
)

export const createIcon = <T extends Record<string, unknown> = Record<string, unknown>>(
  iconNode: IconNode
): FC<{ class?: string } & T> =>
  ({ class: className, ...props }) => (
    <Icon
      iconNode={iconNode}
      class={className}
      {...(props as Record<string, string | number | boolean | undefined>)}
    />
  )

export const AIIcon = createIcon(Bot)
export const ActivityIcon = createIcon(Activity)
export const AppLayoutIcon = createIcon(PanelLeft)
export const AppleIcon = createIcon(Apple)
export const AppStoreIcon = createIcon(Store)
export const ArchiveIcon = createIcon(Archive)
export const ArrowIcon = createIcon(ArrowRight)
export const ArrowLeftIcon = createIcon(ArrowLeft)
export const ArrowRightIcon = createIcon(ArrowRight)
export const ArrowDownIcon = createIcon(ArrowDown)
export const ArrowUpIcon = createIcon(ArrowUp)
export const AssignIcon = createIcon(UserPlus)
export const AtSymbolIcon = createIcon(AtSign)
export const BellIcon = createIcon(Bell)
export const BoldIcon = createIcon(Bold)
export const CalendarIcon = createIcon(Calendar)
export const CameraIcon = createIcon(Camera)
export const ChartIcon = createIcon(ChartColumn)
export const ChatIcon = createIcon(MessageSquare)
export const CheckCircleIcon = createIcon(CircleCheck)
export const CircleAlertIcon = createIcon(CircleAlert)
export const CircleDashedIcon = createIcon(CircleDashed)
export const CircleDotDashedIcon = createIcon(CircleDotDashed)
export const CheckCheckIcon = createIcon(CheckCheck)
export const CheckIcon = createIcon(Check)
export const ChevronDownIcon = createIcon(ChevronDown)
export const ChevronIcon = createIcon(ChevronDown)
export const ChevronLeftIcon = createIcon(ChevronLeft)
export const ChevronRightIcon = createIcon(ChevronRight)
export const ChevronsUpDownIcon = createIcon(ChevronsUpDown)
export const CircleIcon = createIcon(Circle)
export const ClockIcon = createIcon(Clock)
export const CloseIcon = createIcon(X)
export const CodeBlockIcon = createIcon(SquareCode)
export const CodeIcon = createIcon(Code)
export const CogIcon = createIcon(Cog)
export const CommentIcon = createIcon(MessageCircle)
export const CompleteIcon = createIcon(Check)
export const ComponentsIcon = createIcon(Blocks)
export const CopyIcon = createIcon(Copy)
export const CornerDownRightIcon = createIcon(CornerDownRight)
export const CreateIcon = createIcon(Plus)
export const CreditCardIcon = createIcon(CreditCard)
export const DangerIcon = createIcon(TriangleAlert)
export const DeleteIcon = createIcon(Trash2)
export const DesktopIcon = createIcon(Monitor)
export const DollarIcon = createIcon(CircleDollarSign)
export const DownloadIcon = createIcon(Download)
export const EditIcon = createIcon(Pencil)
export const EllipsisIcon = createIcon(Ellipsis)
export const ErrorIcon = createIcon(CircleX)
export const ExternalLinkIcon = createIcon(ExternalLink)
export const FeatureIcon = createIcon(Zap)
export const FileIcon = createIcon(File)
export const FilterIcon = createIcon(Filter)
export const FolderIcon = createIcon(Folder)
export const FolderPlusIcon = createIcon(FolderPlus)
export const FullscreenIcon = createIcon(Maximize)
export const HandshakeIcon = createIcon(Handshake)
export const GridIcon = createIcon(LayoutGrid)
export const HelpIcon = createIcon(CircleHelp)
export const HomeIcon = createIcon(Home)
export const HorizontalRuleIcon = createIcon(Minus)
export const ImageIcon = createIcon(Image)
export const InfoIcon = createIcon(Info)
export const ItalicIcon = createIcon(Italic)
export const KanbanIcon = createIcon(Kanban)
export const KeyIcon = createIcon(Key)
export const LayersIcon = createIcon(Layers)
export const LayoutIcon = createIcon(LayoutTemplate)
export const LinkIcon = createIcon(Link)
export const MapPinIcon = createIcon(MapPin)
export const LockIcon = createIcon(Lock)
export const LoaderCircleIcon = createIcon(LoaderCircle)
export const ListFilterIcon = createIcon(ListFilter)
export const ListIcon = createIcon(List)
export const ListOrderedIcon = createIcon(ListOrdered)
export const ListTodoIcon = createIcon(ListTodo)
export const LogOutIcon = createIcon(LogOut)
export const MailIcon = createIcon(Mail)
export const MarketingIcon = createIcon(Megaphone)
export const MenuIcon = createIcon(Menu)
export const MicIcon = createIcon(Mic)
export const MinimizeIcon = createIcon(Minimize)
export const MobileIcon = createIcon(Smartphone)
export const ModelIcon = createIcon(Bot)
export const MoonIcon = createIcon(Moon)
export const MoreHorizontalIcon = createIcon(MoreHorizontal)
export const MoreIcon = createIcon(MoreVertical)
export const NetworkIcon = createIcon(Share2)
export const PanelLeftIcon = createIcon(PanelLeft)
export const PaperclipIcon = createIcon(Paperclip)
export const PencilIcon = createIcon(Pencil)
export const PhoneIcon = createIcon(Phone)
export const PinIcon = createIcon(Pin)
export const PlayIcon = createIcon(Play)
export const PlusIcon = createIcon(Plus)
export const PreviewIcon = createIcon(Eye)
export const QuestionIcon = createIcon(CircleHelp)
export const QuoteIcon = createIcon(Quote)
export const ReasoningIcon = createIcon(Lightbulb)
export const RedoIcon = createIcon(Redo)
export const RefreshIcon = createIcon(RefreshCw)
export const Rows3Icon = createIcon(Rows3)
export const SearchIcon = createIcon(Search)
export const SendIcon = createIcon(Send)
export const SettingsIcon = createIcon(Settings)
export const ShareIcon = createIcon(Share2)
export const ShieldIcon = createIcon(Shield)
export const ShoppingCartIcon = createIcon(ShoppingCart)
export const SidebarIcon = createIcon(PanelLeft)
export const SignalIcon = createIcon(Signal)
export const SignalHighIcon = createIcon(SignalHigh)
export const SignalLowIcon = createIcon(SignalLow)
export const SignalMediumIcon = createIcon(SignalMedium)
export const SparkleIcon = createIcon(Sparkles)
export const SparklesIcon = createIcon(Sparkles)
export const SpeedIcon = createIcon(Zap)
export const SquareTerminalIcon = createIcon(SquareTerminal)
export const StarIcon = createIcon(Star)
export const StrikethroughIcon = createIcon(Strikethrough)
export const SuccessIcon = createIcon(CircleCheck)
export const SunIcon = createIcon(Sun)
export const TabletIcon = createIcon(Tablet)
export const TerminalIcon = createIcon(Terminal)
export const TrashIcon = createIcon(Trash2)
export const TrendDownIcon = createIcon(TrendingDown)
export const TrendUpIcon = createIcon(TrendingUp)
export const UnderlineIcon = createIcon(Underline)
export const UndoIcon = createIcon(Undo)
export const UpdateIcon = createIcon(RefreshCw)
export const UploadIcon = createIcon(Upload)
export const UserIcon = createIcon(User)
export const UsersIcon = createIcon(Users)
export const WandIcon = createIcon(WandSparkles)
export const WarningIcon = createIcon(TriangleAlert)
export const XIcon = createIcon(X)
