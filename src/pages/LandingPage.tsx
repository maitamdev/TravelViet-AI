import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Plane,
  Sparkles,
  Map,
  Users,
  Calendar,
  ArrowRight,
  Star,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'AI Lên Kế Hoạch',
      description: 'Tự động tạo lịch trình chi tiết theo sở thích, ngân sách và thời gian của bạn',
    },
    {
      icon: Map,
      title: 'Khám Phá Địa Điểm',
      description: 'Gợi ý những địa điểm ẩn giấu, quán ăn ngon và trải nghiệm độc đáo',
    },
    {
      icon: Users,
      title: 'Du Lịch Nhóm',
      description: 'Cùng bạn bè lên kế hoạch, bình chọn và chia sẻ chi phí dễ dàng',
    },
    {
      icon: Calendar,
      title: 'Tối Ưu Thời Gian',
      description: 'Sắp xếp lộ trình hợp lý, tránh đông đúc và tiết kiệm thời gian',
    },
  ];

  const stats = [
    { value: '63', label: 'Tỉnh thành' },
    { value: '1000+', label: 'Điểm đến' },
    { value: '100%', label: 'Miễn phí' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pattern-lantern">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12"
        >
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="TravelViet Logo"
              className="h-10 w-auto"
            />
            <span className="font-bold text-xl">TravelViet</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Button asChild className="btn-hero">
                <Link to="/dashboard">
                  Vào Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button asChild className="btn-hero">
                  <Link to="/register">Bắt đầu miễn phí</Link>
                </Button>
              </>
            )}
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              <span className="text-sm font-medium">AI-Powered Travel Planning</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="text-gradient">Khám Phá Việt Nam</span>
              <br />
              <span className="text-foreground">Cùng Trợ Lý AI Thông Minh</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              TravelViet giúp bạn lên kế hoạch du lịch hoàn hảo với công nghệ AI,
              từ lịch trình chi tiết đến gợi ý địa điểm ẩn giấu và quản lý chi phí.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button asChild size="lg" className="btn-hero text-lg px-8">
                <Link to={user ? '/dashboard' : '/register'}>
                  {user ? 'Vào Dashboard' : 'Bắt Đầu Miễn Phí'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/community">
                  Khám Phá Lịch Trình
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex justify-center gap-8 lg:gap-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl lg:text-4xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tính Năng <span className="text-gradient">Nổi Bật</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Công nghệ AI tiên tiến kết hợp với kiến thức địa phương sâu sắc
              để mang đến trải nghiệm du lịch hoàn hảo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                className="p-6 rounded-2xl bg-card border border-border card-hover"
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -10, 10, -10, 0]
                  }}
                  transition={{ duration: 0.5 }}
                  className="icon-badge w-12 h-12 mb-4"
                >
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Cách <span className="text-gradient">Hoạt Động</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Nhập Thông Tin',
                description: 'Cho chúng tôi biết điểm đến, thời gian và ngân sách của bạn',
              },
              {
                step: '02',
                title: 'AI Lên Kế Hoạch',
                description: 'Trợ lý AI tạo lịch trình chi tiết tối ưu cho chuyến đi',
              },
              {
                step: '03',
                title: 'Khởi Hành!',
                description: 'Tận hưởng chuyến du lịch với hướng dẫn chi tiết từng bước',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-xl font-bold text-primary-foreground">{item.step}</span>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 lg:gap-16"
          >
            {[
              { icon: Star, text: 'Được đánh giá 5 sao' },
              { icon: Zap, text: 'Lên kế hoạch trong 30s' },
              { icon: Shield, text: 'Bảo mật dữ liệu' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-border"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Sẵn Sàng Khám Phá Việt Nam?
            </h2>
            <p className="text-muted-foreground mb-8">
              Tham gia cùng hàng nghìn du khách đang sử dụng TravelViet để lên kế hoạch
              cho những chuyến đi đáng nhớ
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="btn-hero text-lg px-8">
                <Link to={user ? '/dashboard' : '/register'}>
                  Bắt Đầu Ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="TravelViet Logo"
                className="h-5 w-auto"
              />
              <span className="font-semibold">TravelViet</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TravelViet. AI Travel Operating System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
